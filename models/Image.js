const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    image : {
        type : String,
        required : true,
    }
});

const Image = mongoose.model('image', ImageSchema);

module.exports = Image;