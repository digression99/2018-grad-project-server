const fs = require('fs');
const path = require('path');
const pify = require('pify');

const {getDetectedFace,
    trimFaceImageRotation,
    trimFaceImageScale,
    makeFaceMatrix,
    imageProcessToMatrix,
    faceDetect} = require('../apis/face-detection');

// const files = fs.readdirSync(path.join(__dirname, 'testset4'))
// fs.readdir(path.join(__dirname, 'testset4'), (err, files) => {
//     if (err) return console.log(err);
//     let imgArr = [];
//     try {
//         files.forEach(file => {
//             console.log(file);
//             const img = fs.readFileSync(path.join(__dirname, `testset4/${file}`));
//             const imgBase64 = new Buffer(img).toString('base64');
//             imgArr.push(imgBase64);
//         });
//         faceDetect(imgArr);
//     } catch (e) {
//         console.log(e);
//     }
// });

const folderName = 'data_set2';

pify(fs.readdir)(path.join(__dirname, folderName))
    .then(files => {
        let jsonArr = [];
        const jsonReg = new RegExp(/(.json)$/);
        files.forEach(file => {
            if (file.match(jsonReg)) {
                console.log(file);
                const jsonData = fs.readFileSync(path.join(__dirname, `${folderName}/${file}`));
                jsonArr.push(JSON.parse(jsonData));
            }
        });

        faceDetect(jsonArr);
    });

