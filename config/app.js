require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('../routes/index');
const connection = require('./db');
const errorMiddleware = require('../middlewares/error-middleware');

const app = express();
connection();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL
  })
);
app.use('/api', router);
app.use(errorMiddleware);

module.exports = app;
