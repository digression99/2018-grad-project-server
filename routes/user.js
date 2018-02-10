const express = require('express');
const User = require('../models/User');
const Image = require('../models/Image');
const ImageWrapper = require('../models/ImageWrapper');
const ProcessedDatum = require('../models/ProcessedDatum');
const getDetectedFaceFromFile = require('../playground/getDetectedFaceFromFile');
const {
    clusterData,
    detectedFaceToVector,
} = require('../api/face-detection');
const uuidv1 = require('uuid/v1');

const {imagesToValues} = require('../api/utility');

const net = require('../api/neural-network');

let router = express.Router();

router.post('/register', async (req, res) => { // 걍가입
    try {
        const user = new User({
            email: req.body.email,
            password: req.body.password, // encryption is in User.pre().
            deviceId : uuidv1()
        });
        await user.save();

        res.json({
            user,
            success: true
        });
    } catch (e) {
        res.status(400).json({
            e,
            success: true
        });
    }
});

// const faceRegister = (req, res) => new Promise((resolve, reject) => {
//     // if promise returns, then you lose the local variables.
//     // how could that be handled?
//
// });

// const faceRegister = async (req, res) => {
//     try {
//
//         // for more than one image,
//             // get processed image data from google api (in test, from local files)
//             // save it into the mongodb
//             // save image if it's correctly processed. (there's a change that the image couldn't be processed by google api.)
//             // use the datum th make a vector.
//         // wait for all the vector to be made. (Promise.all)
//         // process the clustering algorithm.
//         // make ImageWrapper and save it to mongo.
//         // find user in the db using email and update the user.
//         // return success.
//
//
//
//
//
//     } catch (e) {
//         res.status(400).json({
//             error : e,
//             success : false
//         });
//     }
// };

// const processImagesToVector = (images) => new Promise(async (resolve, reject) => {
//
//     let detectedFaces = [];
//     let processedDataIds = [];
//     let faceImageIds = [];
//
//     try {
//         images.forEach(async image => {
//             const processedDatum = await getDetectedFaceFromFile(image);
//             if (processedDatum) {
//                 const faceImage = new Image({image}); // save image data.
//                 await faceImage.save(); // save image to
//
//                 const datum = new ProcessedDatum({processedDatum});
//                 await datum.save();
//
//
//             }
//
//         })
//     } catch (e) {
//         reject(e);
//     }
// });

const processImagesToCentroid = (images, detectedTime) => new Promise(async (resolve, reject) => {

    let faceImageIdArr = [];
    let processedDataIdArr = [];
    try {
        const values = await Promise.all(images.map(async image => {
            const processedDatum = await getDetectedFaceFromFile(image); // mock function.
            // console.log('got processed datum.');
            if (!processedDatum) throw new Error("no datum.");

            const faceImage = new Image({image});
            await faceImage.save(); // save image.
            // console.log('face image saved.');

            const datum = new ProcessedDatum({processedDatum});
            await datum.save(); // save json file.
            // console.log('processed datum saved.');

            processedDataIdArr.push(datum.id); // save the id for images.
            faceImageIdArr.push(faceImage.id);

            return detectedFaceToVector(processedDatum);
        }));
        console.log(values);

        const imageWrapper = new ImageWrapper({
            images: faceImageIdArr,
            processedData: processedDataIdArr,
            detectedTime
        });
        await imageWrapper.save();

        const result = await clusterData(values);
        console.log("result : ", result);

        resolve({
            centroid : result[0].centroid,
            imageWrapperId :imageWrapper.id
        });
    } catch (e) {
        reject(e);
    }
});

const processImagesAndRegister = (images, detectedTime, email) => new Promise(async (resolve, reject) => {
    try {
        const res = await imagesToValues(images, detectedTime);
        let obj = {};
        obj[`${email}`] = 1;
        const result = await net.register(res.values, obj);
        // const result = await net.detect(values);
        console.log("result : ", result);

        resolve({
            result,
            imageWrapperId :res.imageWrapperId
        });

    } catch (e) {
        reject(e);
    }
});

router.post('/face-register', async (req, res) => { // 얼굴 등록
    const images = req.body.images;
    const detectedTime = req.body.detectedTime; // time when took the images.
    const email = req.body.email;

    try {
        // const result = await processImagesToCentroid(images, detectedTime);
        const res = await processImagesAndRegister(images, detectedTime, email);

        const foundUser = await User.findByEmail(email);
        const updatedUser = await foundUser.update({
            // email,
            // centroid: result.centroid,
            imageWrapperId: res.imageWrapperId
        });
        console.log('user saved.');

        res.json({
            updatedUser,
            success: true
        });
    } catch (e) {
        res.json({
            e,
            success: false
        });
    }
});

module.exports = router;


