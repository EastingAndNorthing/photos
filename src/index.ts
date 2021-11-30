import { getConfig } from "./config";
import { routeAlbums } from './routes/album';
import { routePhotos } from "./routes/photos";
import connect from './core/DB';

const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const cors = require('cors');
const http = require('http');

const app = express();
// const baseDir = (getConfig('env') == 'prod') ? __dirname : path.join(__dirname, '../../src/dashboard');
const baseDir = path.join(__dirname, '../src/');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/', express.static(path.join(baseDir, 'public')))
app.options('*', cors());

connect(getConfig('dbUrl'));
routeAlbums(app);
routePhotos(app);

const httpServer = http.createServer(app);
httpServer.listen(getConfig('port'), () => {
    console.log(`HTTP Server running on port ${getConfig('port')}`);
});
