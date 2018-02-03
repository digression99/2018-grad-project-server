const mongoose = require('mongoose');

const ProcessedDatumSchema = new mongoose.Schema({
    processedDatum : {
        type : Schema.Types.Mixed,
        required : true,
    }
});

const ProcessedDatum = mongoose.model('image', ProcessedDatumSchema);

module.exports = ProcessedDatum;