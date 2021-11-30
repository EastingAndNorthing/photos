import { Application } from 'express';
import { PhotoController } from '../controller/PhotoController';

export function routePhotos(app: Application) {

  app.get('/api/photo', async (req, res) => {
    return res.json(await PhotoController.findAll());
  });
  
}