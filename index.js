const express = require('express');
const config = require('./config/config');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('./db/mongoose');

const apiRouter = require('./routes/api');
const userRouter = require('./routes/user');

// const helmet = require('helmet');
// app.use(helmet());
// const compression = require('compress');
// app.use(compression());

// mongoose connect
mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_URI);

// process.on('uncaughtException', (err) => {
//     console.log('uncaught exception : ', err);
// });

const app = express();

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());

app.use('/api', apiRouter);
app.use('/user', userRouter);

app.get('*', (req, res) => {
    res.send('index.html');
});

app.listen(config.PORT, () => {
    console.log(`server listening on port ${config.PORT}`);
});