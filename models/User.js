const mongoose = require('mongoose');
const validator = require('validator');

let UserSchema = new mongoose.Schema({
    centroid : {
        type : [Number],
        required : false,
    },
    email : {
        type : String,
        required : true,
        minlength : 1,
        trim : true,
        unique : true, // make it unique.
        validate: {
            validator : validator.isEmail, // work on it's own. // function
            message : '{value} is not a valid number'
        }
    },
    password : {
        type : String,
        required : true,
        minlength : 1
    },
    deviceId : {
        type : String,
        required : false,
        unique : true,
    },
    devicePosition : {
        type : [Number],
        required : false,
    },
    ImagesId : {
        type : String,
        required : false
    }
});

UserSchema.statics.findByEmail = function (email) {
    let User = this;
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({email});
            if (!user) throw new Error("no user found.");
            resolve(user);
        } catch (e) {
            reject(e);
        }
    });
};

UserSchema.statics.findByCentroid = function (centroid) {
    let User = this;
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({centroid});
            if (!user) throw new Error("no user found.");
            resolve(user);
        } catch (e) {
            reject(e);
        }
    })
};

let User = mongoose.model('user', UserSchema);
module.exports = User;