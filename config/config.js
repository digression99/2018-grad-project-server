const env = process.env.NODE_ENV || 'development';

let config = {
    PORT : process.env.PORT || 3000,
    MONGODB_URI : "",
    ENV : env
};

const envConfig = require('./config.json')[env];
// console.log(envConfig);

if (envConfig) Object.keys(envConfig).forEach(key => config[key] = envConfig[key]);

if (env === 'production' || env === 'development') {
    config.PORT = process.env.PORT || config.PORT;
    config.MONGODB_URI = process.env.MONGODB_URI || config.MONGODB_URI;
}

console.log(envConfig);

if (require.main == module) {
    console.log(config);
} else {
    module.exports = config;
}
