const mongoose = require('mongoose');

const ProcessedDatumSchema = new mongoose.Schema({
    processedDatum : {
        type : mongoose.Schema.Types.Mixed,
        required : true,
    }
});

const ProcessedDatum = mongoose.model('processedDatum', ProcessedDatumSchema);

module.exports = ProcessedDatum;