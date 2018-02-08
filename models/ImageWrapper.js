const mongoose = require('mongoose');
const Image = require('./Image');
const ProcessedDatum = require('./ProcessedDatum');

const ImageWrapperSchema = new mongoose.Schema({
    images : { // ids.
        type : [mongoose.Schema.Types.ObjectId],
        required : true
    },
    processedData : {
        type : [mongoose.Schema.Types.ObjectId],
        required : true
    },
    detectedTime : {
        type : Number,
        required : true
    }
});

let ImageWrapper = mongoose.model('imageWrapper', ImageWrapperSchema);

module.exports = ImageWrapper;