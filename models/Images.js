const mongoose = require('mongoose');
const Image = require('./Image');
const ProcessedDatum = require('./ProcessedDatum');

const ImagesSchema = new mongoose.Schema({
    images : { // ids.
        type : [String],
        required : true
    },
    processedData : {
        type : [String],
        required : true
    },
    detectedTime : {
        type : Number,
        required : true
    }
});


let Images = mongoose.model('user', ImagesSchema);

module.exports = Images;