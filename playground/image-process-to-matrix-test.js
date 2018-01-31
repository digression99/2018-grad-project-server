const fs = require('fs');
const path = require('path');
const math = require('mathjs');

const imagePath = path.join(__dirname, 'image_data_2.json');

const getDetectedFace = (image) => new Promise((resolve, reject) =>
    fs.readFile(imagePath, (err, data) => {
        if (err) reject(err);
        const loadedData = JSON.parse(data);

        console.log('data loaded.');
        // console.log(JSON.stringify(loadedData, undefined, 2));
        resolve(loadedData);
    }));

const trimFaceImageRotation = (faceImageMatrix, pan, tilt, roll) =>
    new Promise((resolve, reject) => {

        const row = faceImageMatrix.size()[0];
        const col = faceImageMatrix.size()[1];

        const panCos = math.cos(math.unit(-pan, 'deg'));
        const panSin = math.sin(math.unit(-pan, 'deg'));
        const panRotationMatrix = math.matrix([
            [panCos, 0, panSin],
            [0, 1, 0],
            [-panSin, 0, panCos]
        ]);
        const afterPan = math.multiply(faceImageMatrix, panRotationMatrix);
        console.log('afterPan : ');
        console.log(afterPan);

        const tiltCos = math.cos(math.unit(-tilt, 'deg'));
        const tiltSin = math.sin(math.unit(-tilt, 'deg'));
        const tiltRotationMatrix = math.matrix([
            [1, 0, 0],
            [0, tiltCos, -tiltSin],
            [0, tiltSin, tiltCos]
        ]);

        let afterTilt = math.multiply(afterPan, tiltRotationMatrix);
        console.log('afterTilt : ');
        console.log(afterTilt);

        const rollCos = math.cos(math.unit(roll, 'deg'));
        const rollSin = math.sin(math.unit(roll, 'deg'));
        const rollRotationMatrix = math.matrix([
            [rollCos, -rollSin, 0],
            [rollSin, rollCos, 0],
            [0, 0, 1]]);

        let afterRoll = math.multiply(afterTilt, rollRotationMatrix);
        console.log('afterRoll : ');
        console.log(afterRoll);

        // for (let i = 0; i < row; ++i) {
        //     let vector = math.transpose(afterTilt.subset(math.index(i , math.range(0, col))));
        //     vector = math.multiply(rollRotationMatrix, vector);
        //     // console.log('vector : ', vector);
        //     afterRoll.subset(math.index(i, math.range(0, col)), math.transpose(vector));
        // }
        // console.log('afterRoll : ', afterRoll);

        // d.subset(math.index([1, 2], [0, 1]));         // Matrix, [[3, 4], [6, 7]]

        return resolve(afterRoll);
    });

const trimFaceImageScale = (faceImageMatrix, faceWidth) =>
    new Promise((resolve, reject) => {
        const ratio = 1000 / faceWidth;

        // faceImageMatrix.forEach((value, index, matrix) => {
        //     const col = index[1];
        //     const row = index[0];
        //
        //     // switch(col) {
        //     //     case 0 :
        //     //         faceImageMatrix.subset(math.index(row, col), value * xRatio);
        //     //         break;
        //     //     case 1:
        //     //         faceImageMatrix.subset(math.index(row, col), value * yRatio);
        //     //         break;
        //     //     case 2:
        //     //         faceImageMatrix.subset(math.index(row, col), value * zRatio);
        //     //         break;
        //     // }
        //     faceImageMatrix.subset(math.index(row, col), value * ratio);
        // });

        const result = math.multiply(faceImageMatrix, ratio);
        // scale processing...
        return resolve(result);
});

const makeFaceMatrix = (result) => new Promise((resolve, reject) => {
        try {
            const leftEyePosX = result[0].faceAnnotations[0].landmarks[0].position.x;
            const leftEyePosY = result[0].faceAnnotations[0].landmarks[0].position.y;
            const leftEyePosZ = result[0].faceAnnotations[0].landmarks[0].position.z;

            const rightEyePosX = result[0].faceAnnotations[0].landmarks[1].position.x;
            const rightEyePosY = result[0].faceAnnotations[0].landmarks[1].position.y;
            const rightEyePosZ = result[0].faceAnnotations[0].landmarks[1].position.z;

            const noseTipPosX = result[0].faceAnnotations[0].landmarks[8].position.x;
            const noseTipPosY = result[0].faceAnnotations[0].landmarks[8].position.y;
            const noseTipPosZ = result[0].faceAnnotations[0].landmarks[8].position.z;

            const mouthCenterPosX = result[0].faceAnnotations[0].landmarks[12].position.x;
            const mouthCenterPosY = result[0].faceAnnotations[0].landmarks[12].position.y;
            const mouthCenterPosZ = result[0].faceAnnotations[0].landmarks[12].position.z;

            const midPointBetweenEyesX = result[0].faceAnnotations[0].landmarks[6].position.x;
            const midPointBetweenEyesY = result[0].faceAnnotations[0].landmarks[6].position.y;
            const midPointBetweenEyesZ = result[0].faceAnnotations[0].landmarks[6].position.z;

            const faceMatrix = math.matrix([
                [leftEyePosX, leftEyePosY, leftEyePosZ],
                [rightEyePosX, rightEyePosY, rightEyePosZ],
                [midPointBetweenEyesX, midPointBetweenEyesY, midPointBetweenEyesZ],
                [noseTipPosX, noseTipPosY, noseTipPosZ],
                [mouthCenterPosX, mouthCenterPosY, mouthCenterPosZ]
            ]);
            // size : [4, 3]

            resolve(faceMatrix);
const trimFaceImageRotation = (faceImageMatrix, pan, tilt, roll) =>
    new Promise((resolve, reject) => {

        const row = faceImageMatrix.size()[0];
        const col = faceImageMatrix.size()[1];

        const panCos = math.cos(math.unit(-pan, 'deg'));
        const panSin = math.sin(math.unit(-pan, 'deg'));
        const panRotationMatrix = math.matrix([
            [panCos, 0, panSin],
            [0, 1, 0],
            [-panSin, 0, panCos]
        ]);
        const afterPan = math.multiply(faceImageMatrix, panRotationMatrix);
        console.log('afterPan : ');
        console.log(afterPan);

        const tiltCos = math.cos(math.unit(-tilt, 'deg'));
        const tiltSin = math.sin(math.unit(-tilt, 'deg'));
        const tiltRotationMatrix = math.matrix([
            [1, 0, 0],
            [0, tiltCos, -tiltSin],
            [0, tiltSin, tiltCos]
        ]);

        let afterTilt = math.multiply(afterPan, tiltRotationMatrix);
        console.log('afterTilt : ');
        console.log(afterTilt);

        const rollCos = math.cos(math.unit(roll, 'deg'));
        const rollSin = math.sin(math.unit(roll, 'deg'));
        const rollRotationMatrix = math.matrix([
            [rollCos, -rollSin, 0],
            [rollSin, rollCos, 0],
            [0, 0, 1]]);

        let afterRoll = math.multiply(afterTilt, rollRotationMatrix);
        console.log('afterRoll : ');
        console.log(afterRoll);

        // for (let i = 0; i < row; ++i) {
        //     let vector = math.transpose(afterTilt.subset(math.index(i , math.range(0, col))));
        //     vector = math.multiply(rollRotationMatrix, vector);
        //     // console.log('vector : ', vector);
        //     afterRoll.subset(math.index(i, math.range(0, col)), math.transpose(vector));
        // }
        // console.log('afterRoll : ', afterRoll);

        // d.subset(math.index([1, 2], [0, 1]));         // Matrix, [[3, 4], [6, 7]]

        return resolve(afterRoll);
    });

const trimFaceImageScale = (faceImageMatrix, faceWidth) =>
    new Promise((resolve, reject) => {
        const ratio = 1000 / faceWidth;

        // faceImageMatrix.forEach((value, index, matrix) => {
        //     const col = index[1];
        //     const row = index[0];
        //
        //     // switch(col) {
        //     //     case 0 :
        //     //         faceImageMatrix.subset(math.index(row, col), value * xRatio);
        //     //         break;
        //     //     case 1:
        //     //         faceImageMatrix.subset(math.index(row, col), value * yRatio);
        //     //         break;
        //     //     case 2:
        //     //         faceImageMatrix.subset(math.index(row, col), value * zRatio);
        //     //         break;
        //     // }
        //     faceImageMatrix.subset(math.index(row, col), value * ratio);
        // });

        const result = math.multiply(faceImageMatrix, ratio);
        // scale processing...
        return resolve(result);
});

const makeFaceMatrix = (result) => new Promise((resolve, reject) => {
        try {
            const leftEyePosX = result[0].faceAnnotations[0].landmarks[0].position.x;
            const leftEyePosY = result[0].faceAnnotations[0].landmarks[0].position.y;
            const leftEyePosZ = result[0].faceAnnotations[0].landmarks[0].position.z;

            const rightEyePosX = result[0].faceAnnotations[0].landmarks[1].position.x;
            const rightEyePosY = result[0].faceAnnotations[0].landmarks[1].position.y;
            const rightEyePosZ = result[0].faceAnnotations[0].landmarks[1].position.z;

            const noseTipPosX = result[0].faceAnnotations[0].landmarks[8].position.x;
            const noseTipPosY = result[0].faceAnnotations[0].landmarks[8].position.y;
            const noseTipPosZ = result[0].faceAnnotations[0].landmarks[8].position.z;

            const mouthCenterPosX = result[0].faceAnnotations[0].landmarks[12].position.x;
            const mouthCenterPosY = result[0].faceAnnotations[0].landmarks[12].position.y;
            const mouthCenterPosZ = result[0].faceAnnotations[0].landmarks[12].position.z;

            const midPointBetweenEyesX = result[0].faceAnnotations[0].landmarks[6].position.x;
            const midPointBetweenEyesY = result[0].faceAnnotations[0].landmarks[6].position.y;
            const midPointBetweenEyesZ = result[0].faceAnnotations[0].landmarks[6].position.z;

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
            const result = getDetectedFace(image);
            // const result = await vision.faceDetection({ content : image });
            // result 를 사용.
            if(!result[0].faceAnnotations) throw new Error("not a face.");
            //
            // const leftEyePosX = result[0].faceAnnotations[0].landmarks[0].position.x;
            // const leftEyePosY = result[0].faceAnnotations[0].landmarks[0].position.y;
            // const leftEyePosZ = result[0].faceAnnotations[0].landmarks[0].position.z;
            //
            // const rightEyePosX = result[0].faceAnnotations[0].landmarks[1].position.x;
            // const rightEyePosY = result[0].faceAnnotations[0].landmarks[1].position.y;
            // const rightEyePosZ = result[0].faceAnnotations[0].landmarks[1].position.z;
            //
            // const noseTipPosX = result[0].faceAnnotations[0].landmarks[8].position.x;
            // const noseTipPosY = result[0].faceAnnotations[0].landmarks[8].position.y;
            // const noseTipPosZ = result[0].faceAnnotations[0].landmarks[8].position.z;
            //
            // const mouthCenterPosX = result[0].faceAnnotations[0].landmarks[12].position.x;
            // const mouthCenterPosY = result[0].faceAnnotations[0].landmarks[12].position.y;
            // const mouthCenterPosZ = result[0].faceAnnotations[0].landmarks[12].position.z;
            //
            // const faceMatrix = math.matrix([
            //     [leftEyePosX, leftEyePosY, leftEyePosZ],
            //     [rightEyePosX, rightEyePosY, rightEyePosZ],
            //     [noseTipPosX, noseTipPosY, noseTipPosZ],
            //     [mouthCenterPosX, mouthCenterPosY, mouthCenterPosZ]
            // ]);

            const faceMatrix = await makeFaceMatrix(result);

            const roll = result[0].faceAnnotations[0].rollAngle; // need test
            const pan = result[0].faceAnnotations[0].panAngle;
            const tilt = result[0].faceAnnotations[0].tiltAngle;
            const rotationTrimmedMatrix = await trimFaceImageRotation(faceMatrix, pan, tilt, roll);

            const faceRectangle = result[0].faceAnnotations[0].fdBoundingPoly.vertices;

            let faceWidth = faceRectangle[1] - faceRectangle[0];
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
        } catch (e) {
            reject(e);
        }
});

const imageProcessToMatrix = (image) => {

    return new Promise(async (resolve, reject) => {
        try {
            const result = getDetectedFace(image);
            // const result = await vision.faceDetection({ content : image });
            // result 를 사용.
            if(!result[0].faceAnnotations) throw new Error("not a face.");
            //
            // const leftEyePosX = result[0].faceAnnotations[0].landmarks[0].position.x;
            // const leftEyePosY = result[0].faceAnnotations[0].landmarks[0].position.y;
            // const leftEyePosZ = result[0].faceAnnotations[0].landmarks[0].position.z;
            //
            // const rightEyePosX = result[0].faceAnnotations[0].landmarks[1].position.x;
            // const rightEyePosY = result[0].faceAnnotations[0].landmarks[1].position.y;
            // const rightEyePosZ = result[0].faceAnnotations[0].landmarks[1].position.z;
            //
            // const noseTipPosX = result[0].faceAnnotations[0].landmarks[8].position.x;
            // const noseTipPosY = result[0].faceAnnotations[0].landmarks[8].position.y;
            // const noseTipPosZ = result[0].faceAnnotations[0].landmarks[8].position.z;
            //
            // const mouthCenterPosX = result[0].faceAnnotations[0].landmarks[12].position.x;
            // const mouthCenterPosY = result[0].faceAnnotations[0].landmarks[12].position.y;
            // const mouthCenterPosZ = result[0].faceAnnotations[0].landmarks[12].position.z;
            //
            // const faceMatrix = math.matrix([
            //     [leftEyePosX, leftEyePosY, leftEyePosZ],
            //     [rightEyePosX, rightEyePosY, rightEyePosZ],
            //     [noseTipPosX, noseTipPosY, noseTipPosZ],
            //     [mouthCenterPosX, mouthCenterPosY, mouthCenterPosZ]
            // ]);

            const faceMatrix = await makeFaceMatrix(result);

            const roll = result[0].faceAnnotations[0].rollAngle; // need test
            const pan = result[0].faceAnnotations[0].panAngle;
            const tilt = result[0].faceAnnotations[0].tiltAngle;
            const rotationTrimmedMatrix = await trimFaceImageRotation(faceMatrix, pan, tilt, roll);

            const faceRectangle = result[0].faceAnnotations[0].fdBoundingPoly.vertices;

            let faceWidth = faceRectangle[1] - faceRectangle[0];
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

// getDetectedFace({image : 'dummy'});

let pan, tilt, roll;
let faceRectangle;
let faceWidth;

getDetectedFace({image : 'dummy'})
    .then(loadedData => {
        roll = loadedData[0].faceAnnotations[0].rollAngle; // need test
        pan = loadedData[0].faceAnnotations[0].panAngle;
        tilt = loadedData[0].faceAnnotations[0].tiltAngle;
        console.log('pan : ', pan);
        console.log('tilt : ', tilt);
        console.log('roll : ', roll);

        faceRectangle = loadedData[0].faceAnnotations[0].fdBoundingPoly.vertices;
        faceWidth = faceRectangle[1].x - faceRectangle[0].x;
        console.log(faceRectangle);

        return makeFaceMatrix(loadedData);
    })
    .then(matrix => {
        // console.log('matrix made.');
        // console.log(matrix);
        // console.log('size : ', matrix.size());
        // const dummy = math.matrix([
        //     [1, 0, 0],
        //     [1, 0, 0],
        //     [1, 0, 0],
        //     [1, 0, 0]
        // ]);
        console.log('org : ', matrix);
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

        console.log('after localization : ');
        console.log(matrix);

        return trimFaceImageRotation(matrix, pan, tilt, roll);
    })
    .then(rotationTrimmedMatrix => {
        console.log('rotation result : ');
        console.log(rotationTrimmedMatrix);

        // const noseX = matrix.subset(math.index(3, 0));
        // const noseY = matrix.subset(math.index(3, 1));
        // const noseZ = matrix.subset(math.index(3, 2));
        //
        // for (let i = 0; i < 5; ++i) {
        //     const orgX = matrix.subset(math.index(i, 0));
        //     const orgY = matrix.subset(math.index(i, 1));
        //     const orgZ = matrix.subset(math.index(i, 2));
        //
        //     matrix.subset(math.index(i, 0), orgX + noseX);
        //     matrix.subset(math.index(i, 1), orgY + noseY);
        //     matrix.subset(math.index(i, 2), orgZ + noseZ);
        // }

        // console.log('faceWidth : ', faceWidth);

        // const xRatio = 1000 / rotationTrimmedMatrix.subset(math.index(0, 0));
        // const yRatio = 1000 / rotationTrimmedMatrix.subset(math.index(0, 1));
        // const zRatio = 1000 / rotationTrimmedMatrix.subset(math.index(0, 2));

        return trimFaceImageScale(rotationTrimmedMatrix, faceWidth);
    })
    .then(scaleTrimmedMatrix => {
        console.log('scale result : ');
        console.log(scaleTrimmedMatrix);

        let normalizedVector = [];
        scaleTrimmedMatrix.forEach((value, index, matrix) => {
            normalizedVector.push(value);
        });
        console.log('normalized vector : ');
        console.log(normalizedVector);
    })
    .catch(e => console.log(e));