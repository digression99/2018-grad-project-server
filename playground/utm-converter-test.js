var UtmConverter = require('utm-converter'); // Example using Node.js.
var converter = new UtmConverter();
// const geocodeAddress = require('./geocode');
// center: {lat: -34.397, lng: 150.644},
//latitude: 37.534934, longitude: 127.090326

const coord1 = [145.240917, -37.830436];
const coord2 = [127.090326, 37.534934];

const utmResult1 = converter.toUtm({
    coord : coord1
});

const utmResult2 = converter.toUtm({
    coord : coord2
});

console.log(utmResult1);
console.log(utmResult2);

// var utmResult = converter.toUtm({coord: wgsCoord});
// // {"coord":{"x":345196.1971905405,"y":5811540.431764047},"zone":55,"isSouthern":true}
//
// var wgsResult = converter.toWgs(utmResult);
// // {"coord":{"longitude":145.24091699999727,"latitude":-37.83043599999867}}