const math = require('mathjs');

const original = math.matrix([[1, 0, 0], [0, 1, 1], [1, 1, 0]]);
const original2 = math.matrix([[1, 0, 0], [0, 1, 1], [1, 1, 0]]);

const ang = 30;
const cos = math.cos(ang);
const sin = math.sin(ang);

const Rx = math.matrix([
    [1, 0, 0],
    [0, cos, -sin],
    [0, sin, cos]]);
const Ry = math.matrix([
    [cos, 0, sin],
    [0, 1, 0],
    [-sin, 0, cos]]);
const Rz = math.matrix([
    [cos, -sin, 0],
    [sin, cos, 0],
    [0, 0, 1]]);

const rotated = math.multiply(math.multiply(math.multiply(original, Rx), Ry), Rz);

console.log(rotated);
//console.log(math.multiply(Rx, original));
ㅓㅗㅓㅗ허ㅗ허ㅗ허ㅗㅎ
//
// console.log(math.round(math.e, 3));
//
// // functions and constants
// math.round(math.e, 3);            // 2.718
// math.atan2(3, -3) / math.pi;      // 0.75
// math.log(10000, 10);              // 4
// math.sqrt(-4);                    // 2i
// math.pow([[-1, 2], [3, 1]], 2);   // [[7, 0], [0, 7]]
// math.derivative('x^2 + x', 'x');  // 2 * x + 1
//
// // expressions
// math.eval('12 / (2.3 + 0.7)');    // 4
// math.eval('12.7 cm to inch');     // 5 inch
// math.eval('sin(45 deg) ^ 2');     // 0.5
// math.eval('9 / 3 + 2i');          // 3 + 2i
// math.eval('det([-1, 2; 3, 1])');  // -7
//
// // chaining
// math.chain(3)
//     .add(4)
//     .multiply(2)
//     .done(); // 14