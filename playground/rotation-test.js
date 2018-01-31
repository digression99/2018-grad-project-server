const math = require('mathjs');

const pan = 90;
const matrix = math.matrix([
    [-1, 0, 0],
    [0, 0, 0],
    [0, 0, -1]
]);

const panCos = math.cos(math.unit(pan, 'deg'));
const panSin = math.sin(math.unit(pan, 'deg'));
const panRotationMatrix = math.matrix([
    [panCos, 0, panSin],
    [0, 1, 0],
    [-panSin, 0, panCos]
]);
const afterPan = math.multiply(matrix, panRotationMatrix);
console.log('afterPan : ');
console.log(afterPan);
console.log(math.cos(math.unit(90 , 'deg')));