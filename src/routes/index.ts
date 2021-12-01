import { Router } from 'express';
import { AlbumController } from '../controller/AlbumController';
import { PhotoController } from '../controller/PhotoController';

const r = Router();

r.use('/api/album', new AlbumController().router);
r.use('/api/photo', new PhotoController().router);

export default r;
