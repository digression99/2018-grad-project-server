const express = require('express');
const pify = require('pify');

const {
    getDetectedFace,
    trimFaceImageRotation,
    trimFaceImageScale,
    makeFaceMatrix,
    imageProcessToMatrix,
    faceDetect,
    getDetectedFaceFromFile,
    clusterData
} = require('../api/face-detection');

const Images = require('../models/Images');
const User = require('../models/User');
const ProcessedDatum = require('../models/ProcessedDatum');
const Image = require('../models/Image');

let router = express.Router();

router.post('/face-detect', async (req, res) => {

    const images = req.body.images;
    const detectedTime = req.body.detectedTime; // time when took the images.
    let promiseArr = [];
    let processedDataIdArr = [];
    let faceImageArr = []; // to save faceImages.

    try {
        images.forEach(async image => {
            try {
                const processedDatum = await getDetectedFaceFromFile(image); // mock function.

                const faceImage = new Image({image});
                await faceImage.save(); // save image.

                const datum = new ProcessedDatum({processedDatum});
                await datum.save(); // save json file.
                processedDataIdArr.push(datum.id); // save the id for images.
                faceImageArr.push(faceImage.id);
            } catch (e) {
                console.log("no face.");
            }
        });

        await new Images({
            images : faceImageArr,
            processedData : processedDataIdArr,
            detectedTime
        }).save();

        const values = await Promise.all(promiseArr);
        const result = await clusterData(values);
        const user = await User.findByCentroid(result);

        res.json({
            user,
            success : true
        });
    } catch (e) {
        res.json({
            e,
            success : false
        });
    }
});

module.exports = router;

