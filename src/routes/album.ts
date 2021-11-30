import { Application } from 'express';
import { AlbumController } from '../controller/AlbumController';

export function routeAlbums(app: Application) {

  app.get('/api/album', async (req, res) => {
    return res.json(await AlbumController.findAll());
  });

}