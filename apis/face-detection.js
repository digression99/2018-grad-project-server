const vision = require('@google-cloud/vision');
// const kmeans = require('node-kmeans');
const math = require('mathjs');
const kmeans = require('node-kmeans');
const pify = require('pify');

// const vision = Vision();
// const getDetectedFace = (image) => vision.faceDetection({content : image});
const client = new vision.ImageAnnotatorClient();
// const request = {image: {source: {filename: path.join(__dirname, 'testset4/camera00000017.jpg')}}};

const getDetectedFace = (image) =>
    new Promise((resolve, reject) => {
        resolve(image[0].faceAnnotations[0]);

        console.log('getDetectedFace!');
        client
            .faceDetection(
                {
                    image : {
                        content : image
                    }
                    // , features : [
                    //     {
                    //         type
                    //     }
                    // ]
                }
            )
            .then(result => {
                if(!result[0].faceAnnotations) throw new Error("not a face.");
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

const trimFaceImageScale = (faceImageMatrix, faceWidth) =>
    new Promise((resolve, reject) => {
        const ratio = 1000 / faceWidth;
        const result = math.multiply(faceImageMatrix, ratio);
        return resolve(result);
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
        // size : [4, 3]

        resolve(faceMatrix);
    } catch (e) {
        reject(e);
    }
});

const imageProcessToMatrix = (image) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await getDetectedFace(image);

            const faceMatrix = await makeFaceMatrix(result);
            console.log('face Matrix : ');
            console.log(faceMatrix);

            const roll = result.rollAngle; // need test
            const pan = result.panAngle;
            const tilt = result.tiltAngle;

            const noseX = faceMatrix.subset(math.index(3, 0));
            const noseY = faceMatrix.subset(math.index(3, 1));
            const noseZ = faceMatrix.subset(math.index(3, 2));

            for (let i = 0; i < 5; ++i) {
                const orgX = faceMatrix.subset(math.index(i, 0));
                const orgY = faceMatrix.subset(math.index(i, 1));
                const orgZ = faceMatrix.subset(math.index(i, 2));

                faceMatrix.subset(math.index(i, 0), orgX - noseX);
                faceMatrix.subset(math.index(i, 1), orgY - noseY);
                faceMatrix.subset(math.index(i, 2), orgZ - noseZ);
            }

            console.log('after localization : ');
            console.log(faceMatrix);

            const rotationTrimmedMatrix = await trimFaceImageRotation(faceMatrix, pan, tilt, roll);

            const faceRectangle = result.fdBoundingPoly.vertices;
            const faceWidth = faceRectangle[1].x - faceRectangle[0].x;

            console.log('faceWidth : ', faceWidth);
            // const faceHeight = (faceRectangle[2] - faceRectangle[1]) * (1000 / faceWidth);

            const scaleTrimmedMatrix = await trimFaceImageScale(rotationTrimmedMatrix, faceWidth);
            // change faceWidth to 1000.

            // 벡터로 변환한 다음에 배열에 넣는다.
            let normalizedVector = [];
            scaleTrimmedMatrix.forEach((value, index, matrix) => {
                normalizedVector.push(value);
            });
            resolve(normalizedVector);
        } catch (e) {
            reject(e);
        }
    })
};

const faceDetect = async (images) => {
    let promiseArr = [];

    // image preprocessing.
    images.forEach(image => {
        promiseArr.push(imageProcessToMatrix(image));
    });

    // clustering.
    Promise.all(promiseArr)
        .then(values => {
            // values 는 이미지를 분석한 faceData.
            // 벡터를 만들어야 한다.
            console.log(values);
            // clusterize.
            return pify(kmeans.clusterize)(values, {k : 1});
        })
        .then(data => {
            console.log(JSON.stringify(data, undefined, 2));
        })
        .catch(e => console.log(e));
};

// const faceRegister;
module.exports = {
    getDetectedFace,
    trimFaceImageRotation,
    trimFaceImageScale,
    makeFaceMatrix,
    imageProcessToMatrix,
    faceDetect
};
