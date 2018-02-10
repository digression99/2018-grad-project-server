const net = require('../../api/neural-network');
const {getDetectedFaceFromFiles} = require('../../playground/getDetectedFaceFromFile');

const {
    detectedFaceToVector,
} = require('../../api/face-detection');

(async () => {

    // data setting.
    const dataset1 = await getDetectedFaceFromFiles(1); // preprocess.
    const dataset2 = await getDetectedFaceFromFiles(2);
    const dataset3 = await getDetectedFaceFromFiles(3);
    const dataset4 = await getDetectedFaceFromFiles(4); // run data.
    const dataset5 = await getDetectedFaceFromFiles(5); // run data.
    const dataset6 = await getDetectedFaceFromFiles(6); // run data.
    const dataset7 = await getDetectedFaceFromFiles(7); // run data.

    const dataset1Values = await Promise.all(dataset1.map(face => detectedFaceToVector(face)));
    const dataset2Values = await Promise.all(dataset2.map(face => detectedFaceToVector(face)));
    const dataset3Values = await Promise.all(dataset3.map(face => detectedFaceToVector(face)));
    const dataset4Values = await Promise.all(dataset4.map(face => detectedFaceToVector(face)));
    const dataset5Values = await Promise.all(dataset5.map(face => detectedFaceToVector(face)));
    const dataset6Values = await Promise.all(dataset6.map(face => detectedFaceToVector(face)));
    const dataset7Values = await Promise.all(dataset7.map(face => detectedFaceToVector(face)));

    //////////////////////////////////////////////

    net.addDataSetWithOutput(dataset1Values, {ilsik : 1});
    net.addDataSetWithOutput(dataset2Values, {ilsik : 1});
    // net.addDataSetWithOutput(dataset3Values, {ilsik : 1});
    net.addDataSetWithOutput(dataset4Values, {jh : 1});
    net.addDataSetWithOutput(dataset5Values, {bg : 1});
    net.addDataSetWithOutput(dataset6Values, {hg : 1});

    console.log('train start.');
    const res = await net.trainNet();
    console.log('train finished.');
    console.log(res);

    net.detect(dataset7Values);
    net.detect(dataset3Values);
})();