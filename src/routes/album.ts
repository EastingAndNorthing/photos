import { Application } from 'express';
import { AlbumController } from '../controller/AlbumController';

export default ({ app }: {
  app: Application;
}) => {

  app.get('/api/album', async (req, res) => {
    const result = await AlbumController.findAll();
    return res.json(result);
  });

  // app.post('/api/user', async (req, res) => {
  //   const user = await AlbumController.CreateUser({
  //     firstName: req.body.firstName,
  //     lastName: req.body.lastName,
  //     email: req.body.email
  //   });

  //   return res.send({ user });
  // });
};