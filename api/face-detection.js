const vision = require('@google-cloud/vision');
const math = require('mathjs');
const pify = require('pify');

const LANDMARK_LENGTH = 34; // MAX 34
const NOSE_POS = 7;

const client = new vision.ImageAnnotatorClient();
// const request = {image: {source: {filename: path.join(__dirname, 'testset4/camera00000017.jpg')}}};

const getDetectedFace = (image) => new Promise((resolve, reject) => {
    client
        .faceDetection({
            image: {content: image}
            // , features : [
            //     {
            //         type
            //     }
            // ]
        })
        .then(result => {
            if (!result[0].faceAnnotations) throw new Error("not a face.");

            const face = result[0].faceAnnotations[0];
            resolve(face);
        })
        .catch(err => {
            reject(err);
        });
});

const trimFaceImageRotation = (faceImageMatrix, pan, tilt, roll) =>
    new Promise((resolve, reject) => {
        const panCos = math.cos(math.unit(-pan, 'deg'));
        const panSin = math.sin(math.unit(-pan, 'deg'));
        const panRotationMatrix = math.matrix([
            [panCos, 0, panSin],
            [0, 1, 0],
            [-panSin, 0, panCos]
        ]);
        const afterPan = math.multiply(faceImageMatrix, panRotationMatrix);

        const tiltCos = math.cos(math.unit(-tilt, 'deg'));
        const tiltSin = math.sin(math.unit(-tilt, 'deg'));
        const tiltRotationMatrix = math.matrix([
            [1, 0, 0],
            [0, tiltCos, -tiltSin],
            [0, tiltSin, tiltCos]
        ]);
        let afterTilt = math.multiply(afterPan, tiltRotationMatrix);

        const rollCos = math.cos(math.unit(roll, 'deg'));
        const rollSin = math.sin(math.unit(roll, 'deg'));
        const rollRotationMatrix = math.matrix([
            [rollCos, -rollSin, 0],
            [rollSin, rollCos, 0],
            [0, 0, 1]]);
        let afterRoll = math.multiply(afterTilt, rollRotationMatrix);

        return resolve(afterRoll);
    });

const trimFaceImageScale = (matrix, faceWidth, faceHeight) => new Promise((resolve, reject) => {
    try {
        // scale matrix.
        const ratioX = 1000 / faceWidth;
        const ratioY = 1000 / faceHeight;
        const ratioZ = ratioY;

        for (let i = 0; i < LANDMARK_LENGTH; ++i) {
            const orgX = matrix.subset(math.index(i, 0));
            const orgY = matrix.subset(math.index(i, 1));
            const orgZ = matrix.subset(math.index(i, 2));

            let scaledX = orgX * ratioX;
            let scaledY = orgY * ratioY;
            let scaledZ = orgZ * ratioZ;
            //
            // // modification.
            // if (scaledX > 1.0) scaledX = 1;
            // if (scaledY > 1.0) scaledY = 1;
            // if (scaledZ > 1.0) scaledZ = 1;

            matrix.subset(math.index(i, 0), scaledX);
            matrix.subset(math.index(i, 1), scaledY);
            matrix.subset(math.index(i, 2), scaledZ);
        }

        return resolve(matrix);
    } catch (e) {
        reject(e);
    }
});

const imagesToVectors = (images) => new Promise((resolve, reject) => {
    // db?
    // return
    resolve();
});

const makeFaceMatrix = (result) => new Promise((resolve, reject) => {
    try {
        let landmarksArr = [];
        for (let i = 0; i < LANDMARK_LENGTH; ++i) {
            landmarksArr.push([
                result.landmarks[i].position.x,
                result.landmarks[i].position.y,
                result.landmarks[i].position.z]);
        }
        resolve(math.matrix(landmarksArr));
    } catch (e) {
        reject(e);
    }
});

const localizeMatrix = (matrix) => {

    const noseX = matrix.subset(math.index(NOSE_POS, 0));
    const noseY = matrix.subset(math.index(NOSE_POS, 1));
    const noseZ = matrix.subset(math.index(NOSE_POS, 2));

    for (let i = 0; i < LANDMARK_LENGTH; ++i) {
        const orgX = matrix.subset(math.index(i, 0));
        const orgY = matrix.subset(math.index(i, 1));
        const orgZ = matrix.subset(math.index(i, 2));

        matrix.subset(math.index(i, 0), orgX - noseX);
        matrix.subset(math.index(i, 1), orgY - noseY);
        matrix.subset(math.index(i, 2), orgZ - noseZ);
    }
    return matrix;
};

const makeMatrixToVector = (matrix) => {
    let normalizedVector = [];
    matrix.forEach(value => normalizedVector.push(value));
    return normalizedVector;
};

const normalizeVector = v => v.map(dat => {
    let val = (dat / 1000) + 0.5;
    if (val > 1.0) val = 1;
    return val;
}); // better to have here.

const detectedFaceToVector = face => new Promise(async (resolve, reject) => {
    try {
        const faceMatrix = await makeFaceMatrix(face);

        const localizedMatrix = localizeMatrix(faceMatrix);
        const rotationTrimmedMatrix = await trimFaceImageRotation(localizedMatrix, face.panAngle, face.tiltAngle, face.rollAngle);

        const faceRectangle = face.boundingPoly.vertices;
        const faceWidth = faceRectangle[1].x - faceRectangle[0].x;
        const faceHeight = faceRectangle[2].y - faceRectangle[0].y;

        const scaleTrimmedMatrix = await trimFaceImageScale(rotationTrimmedMatrix, faceWidth, faceHeight);
        const vec = makeMatrixToVector(scaleTrimmedMatrix);
        resolve(normalizeVector(vec));

        // resolve(makeMatrixToVector(scaleTrimmedMatrix));
    } catch (e) {
        reject(e);
    }
});

// const clusterData = vectors => {
//     let sumArr = [];
//     for (let i = 0; i < vectors[0].length; ++i) sumArr.push(0);
//
//     for (let i = 0; i < vectors.length; ++i) {
//         for (let j = 0; j < vectors[i].length; ++j)
//             sumArr[j] += vectors[i][j];
//     }
//
//     return [{centroid: sumArr.map(dat => dat / vectors.length)}];
// };


// const faceDetect = async (images) => {
//     let promiseArr = [];
//
//     // image preprocessing.
//     images.forEach(image => {
//         const jsonData = getDetectedFace(image);
//         promiseArr.push(imageProcessToMatrix(jsonData));
//     });
//
//     // clustering.
//     return Promise.all(promiseArr)
//         .then(values => {
//             let jsonIds = [];
//             let vectors = [];
//
//             values.forEach(value => {
//                 jsonIds.push(value.jsonId);
//                 vectors.push(value.normalizedVector);
//             });
//
//             return new Promise((resolve, reject) => {
//                 try {
//                     const result = pify(kmeans.clusterize)(vectors, {k: 1});
//
//                     resolve({
//                         jsonIds,
//                         result
//                     });
//                 } catch (e) {
//                     reject(e);
//                 }
//             });
//         })
//         .catch(e => console.log(e));
// };

// const faceRegister;
module.exports = {
    getDetectedFace,
    trimFaceImageRotation,
    trimFaceImageScale,
    makeFaceMatrix,
    detectedFaceToVector,
    // faceDetect,
    // clusterData
};
