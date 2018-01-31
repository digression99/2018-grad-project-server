const vision = require('@google-cloud/vision');
const fs = require('fs');
const path = require('path');
const pify = require('pify');

// const vision = Vision();
const client = new vision.ImageAnnotatorClient();
const request = {image: {source: {filename: path.join(__dirname, 'testset4/camera00000021.jpg')}}};
client
    .faceDetection(request)
    .then(results => {
        const faces = results[0].faceAnnotations;

        console.log('Faces:');
        faces.forEach((face, i) => {
            console.log(`  Face #${i + 1}:`);
            console.log(`    Joy: ${face.joyLikelihood}`);
            console.log(`    Anger: ${face.angerLikelihood}`);
            console.log(`    Sorrow: ${face.sorrowLikelihood}`);
            console.log(`    Surprise: ${face.surpriseLikelihood}`);
        });
        fs.writeFile('image_data_15.json', JSON.stringify(results, undefined, 2), (err) => {
            if (err) return console.log(err);
            console.log('data saved!');

        });
    })
    .catch(err => {
        console.error('ERROR:', err);
    });
//
// fs.readFile(path.join(__dirname, 'testset4/camera.jpg'), (err, data) => {
//     if (err) return console.log(err);
//     // console.log(typeof data);
//     const imgBase64 = new Buffer(data).toString('base64');
//     console.log(imgBase64);
//
//     // client
//     //     .faceDetection({ content : imgBase64 })
//     //     .then(results => {
//     //         const faces = results[0].faceAnnotations;
//     //
//     //         console.log('Faces:');
//     //         faces.forEach((face, i) => {
//     //             console.log(`  Face #${i + 1}:`);
//     //             console.log(`    Joy: ${face.joyLikelihood}`);
//     //             console.log(`    Anger: ${face.angerLikelihood}`);
//     //             console.log(`    Sorrow: ${face.sorrowLikelihood}`);
//     //             console.log(`    Surprise: ${face.surpriseLikelihood}`);
//     //         });
//     //         fs.writeFile('image_data_1.json', results, (err) => {
//     //             if (err) return console.log(err);
//     //             console.log('data saved!');
//     //         });
//     //     })
//     //     .catch(err => {
//     //         console.error('ERROR:', err);
//     //     });
//     //
//     // vision.faceDetection({ content : imgBase64 })
//     //     .then(data => {
//     //         fs.writeFile('image_data_1.json', data, (err) => {
//     //             if (err) return console.log(err);
//     //             console.log('data saved!');
//     //         });
//     //     })
//     //     .catch(e => {
//     //         console.log(e);
//     //     });
// });