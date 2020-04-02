const cors = require('cors');
const express = require('express');

const gifsRouter = require('./routes/gifs');
const { handleErrors, handle404Error } = require('./utils/errorHandler');

const app = express();

app.use(cors());

app.use('/gifs', gifsRouter);

app.get('/', (req, res) => res.send('Hello from my project!'));

app.use(handle404Error);

app.use(handleErrors);

module.exports = app;
