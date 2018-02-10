const express = require('express');
// const pify = require('pify');

// const {detectedFaceToVector} = require('../api/face-detection');
//
// const {getDetectedFaceFromFile} = require('../playground/getDetectedFaceFromFile');

const {imagesToValues} = require('../api/utility');

// const ImageWrapper = require('../models/ImageWrapper');
const User = require('../models/User');
// const ProcessedDatum = require('../models/ProcessedDatum');
// const Image = require('../models/Image');

const net = require('../api/neural-network');
let router = express.Router();
//
// const processImagesToCentroid = (images, detectedTime) => new Promise(async (resolve, reject) => {
//
//     let faceImageIdArr = [];
//     let processedDataIdArr = [];
//     try {
//         const values = await Promise.all(images.map(async image => {
//             const processedDatum = await getDetectedFaceFromFile(image); // mock function.
//             if (!processedDatum) throw new Error("no datum.");
//
//             const faceImage = new Image({image});
//             await faceImage.save(); // save image.
//
//             const datum = new ProcessedDatum({processedDatum});
//             await datum.save(); // save json file.
//
//             processedDataIdArr.push(datum.id); // save the id for images.
//             faceImageIdArr.push(faceImage.id);
//
//             return detectedFaceToVector(processedDatum);
//         }));
//         console.log(values);
//
//         const imageWrapper = new ImageWrapper({
//             images: faceImageIdArr,
//             processedData: processedDataIdArr,
//             detectedTime
//         });
//         await imageWrapper.save();
//
//         const result = await clusterData(values);
//         console.log("result : ", result);
//
//         resolve({
//             centroid : result[0].centroid,
//             imageWrapperId :imageWrapper.id
//         });
//     } catch (e) {
//         reject(e);
//     }
// });

const processImagesAndDetect = (images, detectedTime) => new Promise(async (resolve, reject) => {
    try {
        const res = await imagesToValues(images, detectedTime);
        const result = await net.detect(res.values);
        console.log("result : ", result);

        resolve({
            result,
            imageWrapperId : res.imageWrapperId
        });
    } catch (e) {
        reject(e);
    }
});

router.post('/face-detect', async (req, res) => {
    try {
        const images = req.body.images;
        const detectedTime = req.body.detectedTime; // time when took the images.
        const res = await processImagesAndDetect(images, detectedTime); // how about separating db part?

        if (!res) { // if no one's detected.
            res.json({
                user : "stranger",
                success : true
            })
        }

        // re-train the net with tags.

        const foundUser = await User.findById(res);
        res.json({
            user : foundUser,
            success : true
        });
    } catch (e) {
        console.log(e);
        res.json({
            e,
            success: false
        });
    }
});


module.exports = router;

