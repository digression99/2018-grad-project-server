const express = require('express');
const User = require('../models/User');
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

const processImagesAndRegister = (images, detectedTime, email) => new Promise(async (resolve, reject) => {
    try {
        const res = await imagesToValues(images, detectedTime);
        let obj = {};
        obj[`${email}`] = 1;
        const result = await net.register(res.values, obj);
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
        const res = await processImagesAndRegister(images, detectedTime, email);

        const foundUser = await User.findByEmail(email);
        const updatedUser = await foundUser.update({
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


