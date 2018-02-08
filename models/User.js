const mongoose = require('mongoose');
const validator = require('validator');
const uuidv1 = require('uuid/v1');

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
        // unique : true,
    },
    devicePosition : {
        type : [Number],
        required : false,
    },
    imageWrapperId : {
        type : mongoose.Schema.Types.ObjectId,
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

const getMeanError = (centroid1, centroid2) => {
    let error = 0;

    for (let i = 0; i < centroid1.length; ++i) {
        error += Math.pow(centroid1[i] - centroid2[i], 2);
    }
    return error;
};

UserSchema.statics.findByCentroid = function (centroid) {
    console.log("find by centroid : ", centroid);
    let User = this;
    return new Promise(async (resolve, reject) => {
        try {
            // const query = await User.find({$where : 'this.centroid !== null'});

            // const query = await User.find({$where : ''function() {
            //     let error = 0;
            //
            //     for (let i = 0; i < this.centroid.length; ++i) {
            //         error += Math.pow(this.centroid - centroid, 2);
            //     }
            //     return error <= 500;
            //     // return getMeanError(this.centroid, centroid) <= 500;
            // }});

            const users = await User.find({$where : 'this.centroid !== null'});
            if (!users) throw new Error("no user found.");

            let minIdx = -1, minError = 500;
            for (let i = 0; i < users.length; i++) {
                console.log("now user email : ", users[i].email);
                let nowMin = getMeanError(users[i].centroid, centroid);
                console.log("now min : ", nowMin);
                if (minError > nowMin) {
                    minError = nowMin;
                    minIdx = i;
                }
            }
            if (minIdx === -1) throw new Error("no centroid found.");

            console.log(minError);
            resolve(users[minIdx]);
        } catch (e) {
            reject(e);
        }
    })
};

let User = mongoose.model('user', UserSchema);
module.exports = User;