const express = require('express');
const config = require('./config/config.json');

// require babel-cli installation.
// import {express} from 'express';
// import {config} from './config/config.json';

const app = express();

// app.on('error', (e) => {
//     console.log(e);
// });

app.get('/', (req, res) => {
    res.send('index.');
});

app.listen(config.PORT, () => {
    console.log(`server listening on port ${config.PORT}`);
});