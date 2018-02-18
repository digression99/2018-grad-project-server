const vision = require('@google-cloud/vision');
const fs = require('fs');
const path = require('path');

// const vision = Vision();
const client = new vision.ImageAnnotatorClient();
// const request = {image: {source: {filename: path.join(__dirname, 'test_set4_jh/camera00000001.jpg')}}};

const srcFolderName = "test_set5_bg";
const destFolderName = "data_set5";

fs.readdir(path.join(__dirname, srcFolderName), (err, files) => {
    if (err) return console.log(err);
    let count = 0;
    files.forEach(file => {
        const data = fs.readFileSync(path.join(__dirname, `${srcFolderName}/${file}`));
        const imgBase64 = new Buffer(data).toString('base64');

        client.faceDetection(
                {
                    image : {
                        content : imgBase64
                    }
                }
            )
            .then(results => {
                const faces = results[0].faceAnnotations;
                if (!faces) throw new Error('not a face');

                fs.writeFile(`${destFolderName}/image_data_${count++}.json`, JSON.stringify(results, undefined, 2), (err) => {
                    if (err) return console.log(err);
                    console.log('data saved!');
                });
            })
            .catch(err => {
                console.error('ERROR:', err);
            });
    })
});
//
// fs.writeFile('image_data_11.json', JSON.stringify(results, undefined, 2), (err) => {
//     if (err) return console.log(err);
//     console.log('data saved!');
//
// });
// pify(fs.writeFile)('image_data_11.json', JSON.stringify(results, undefined, 2))
//     .then(data => {
//         return pify(fs.readFile)('','');
//     })
//     .then(result => {
//
//
//     })
//     .catch(e => console.log(e));


