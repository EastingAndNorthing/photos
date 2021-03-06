import { getConfig } from "./config";
import connectDB from './core/DB';
import routes from './routes';

const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const cors = require('cors');
const http = require('http');

const app = express();

// const baseDir = (getConfig('env') == 'prod') ? __dirname : path.join(__dirname, '../../src/dashboard');
const baseDir = path.join(__dirname, '../src/');
const storageDir = path.join(__dirname, '../storage/');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.options('*', cors());

app.use('/', express.static(path.join(baseDir, 'public')))
app.use('/storage', express.static(storageDir))

connectDB();
app.use(routes);

const httpServer = http.createServer(app);
httpServer.listen(getConfig('port'), () => {
    console.log(`HTTP Server running on port ${getConfig('port')}`);
});
