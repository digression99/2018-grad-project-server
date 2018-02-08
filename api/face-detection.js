const vision = require('@google-cloud/vision');
// const kmeans = require('node-kmeans');
const math = require('mathjs');
const kmeans = require('node-kmeans');
const pify = require('pify');

// const vision = Vision();
// const getDetectedFace = (image) => vision.faceDetection({content : image});
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

const trimFaceImageScale = (faceImageMatrix, faceWidth) => new Promise((resolve, reject) => {
    try {
        // scale matrix.
        const ratio = 1000 / faceWidth;
        const result = math.multiply(faceImageMatrix, ratio);
        return resolve(result);
    } catch (e) {
        reject(e);
    }
});

const makeFaceMatrix = (result) => new Promise((resolve, reject) => {
    try {
        const leftEyePosX = result.landmarks[0].position.x;
        const leftEyePosY = result.landmarks[0].position.y;
        const leftEyePosZ = result.landmarks[0].position.z;

        const rightEyePosX = result.landmarks[1].position.x;
        const rightEyePosY = result.landmarks[1].position.y;
        const rightEyePosZ = result.landmarks[1].position.z;

        const noseTipPosX = result.landmarks[8].position.x;
        const noseTipPosY = result.landmarks[8].position.y;
        const noseTipPosZ = result.landmarks[8].position.z;

        const mouthCenterPosX = result.landmarks[12].position.x;
        const mouthCenterPosY = result.landmarks[12].position.y;
        const mouthCenterPosZ = result.landmarks[12].position.z;

        const midPointBetweenEyesX = result.landmarks[6].position.x;
        const midPointBetweenEyesY = result.landmarks[6].position.y;
        const midPointBetweenEyesZ = result.landmarks[6].position.z;

        const faceMatrix = math.matrix([
            [leftEyePosX, leftEyePosY, leftEyePosZ],
            [rightEyePosX, rightEyePosY, rightEyePosZ],
            [midPointBetweenEyesX, midPointBetweenEyesY, midPointBetweenEyesZ],
            [noseTipPosX, noseTipPosY, noseTipPosZ],
            [mouthCenterPosX, mouthCenterPosY, mouthCenterPosZ]
        ]);

        resolve(faceMatrix);
    } catch (e) {
        reject(e);
    }
});

const localizeMatrix = (matrix) => {

    const noseX = matrix.subset(math.index(3, 0));
    const noseY = matrix.subset(math.index(3, 1));
    const noseZ = matrix.subset(math.index(3, 2));

    for (let i = 0; i < 5; ++i) {
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

const detectedFaceToVector = face => new Promise(async (resolve, reject) => {
    try {
        // const result = await getDetectedFace(image);

        const faceMatrix = await makeFaceMatrix(face);

        const localizedMatrix = localizeMatrix(faceMatrix);
        const rotationTrimmedMatrix = await trimFaceImageRotation(localizedMatrix, face.panAngle, face.tiltAngle, face.rollAngle);

        const faceRectangle = face.fdBoundingPoly.vertices;
        const faceWidth = faceRectangle[1].x - faceRectangle[0].x;

        const scaleTrimmedMatrix = await trimFaceImageScale(rotationTrimmedMatrix, faceWidth);

        resolve(makeMatrixToVector(scaleTrimmedMatrix));
        // change faceWidth to 1000.
    } catch (e) {
        reject(e);
    }
});

// const clusterData = vectors => pify(kmeans.clusterize)(vectors, {k: 1});

const clusterData = vectors => {
    let sumArr = [];
    for (let i = 0; i < vectors[0].length; ++i) sumArr.push(0);

    for (let i = 0; i < vectors.length; ++i) {
        for (let j = 0; j < vectors[i].length; ++j)
            sumArr[j] += vectors[i][j];
    }

    return [{centroid : sumArr.map(dat => dat / vectors.length)}];
};



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
    clusterData
};
