const env = process.env.NODE_ENV || 'development';

let config = {
    PORT : 0,
    MONGODB_URI : "",
};

const envConfig = require('./config.json')[env];
// console.log(envConfig);

Object.keys(envConfig).forEach(key => config[key] = envConfig[key]);

if (env === 'production' || env === 'development') {
    config.PORT = process.env.PORT || config.PORT;
}

console.log(envConfig);

if (require.main == module) {
    console.log(config);
} else {
    module.exports = config;
}
