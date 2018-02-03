const express = require('express');
const config = require('./config/config');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('./db/mongoose');

const apiRouter = require('./routes/api');
const userRouter = require('./routes/user');

// mongoose connect
mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_URI);

const app = express();

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());

app.use('/api', apiRouter);
app.use('/user', userRouter);

// app.on('error', (e) => {
//     console.log(e);
// });

app.get('*', (req, res) => {
    res.send('index.html');
});

app.listen(config.PORT, () => {
    console.log(`server listening on port ${config.PORT}`);
});