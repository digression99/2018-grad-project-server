const mongoose = require('mongoose');
const net = require('../api/neural-network');

const ProcessedDatumSchema = new mongoose.Schema({
    processedDatum : {
        type : mongoose.Schema.Types.Mixed,
        required : true,
    }
});

const ProcessedDatum = mongoose.model('processedDatum', ProcessedDatumSchema);

module.exports = ProcessedDatum;