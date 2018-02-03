const express = require('express');
const User = require('../models/User');
let router = express.Router();

router.post('/register', async (req, res) => { // 걍가입
    try {
        const user = new User({
            email : req.body.email,
            password : req.body.password // encryption is in User.pre().
        });
        await user.save();

        res.json({
            user,
            success : true
        });
    } catch (e) {
        res.status(400).json({
            e,
            success : true
        });
    }
});

router.post('/face-register', async (req, res) => { // 얼굴 등록
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


