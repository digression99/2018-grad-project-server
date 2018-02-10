const express = require('express');
const {imagesToValues} = require('../api/utility');
const User = require('../models/User');

const net = require('../api/neural-network');
let router = express.Router();

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

