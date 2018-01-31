const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, 'testset4/camera.jpg'), (err, data) => {
    if (err) return console.log(err);
    // console.log(typeof data);
    const imgBase64 = new Buffer(data).toString('base64');
    console.log(imgBase64);
});