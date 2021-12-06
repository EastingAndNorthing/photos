import { Router } from 'express';
import { AlbumController } from '../controller/AlbumController';
import { PhotoController } from '../controller/PhotoController';
import { FileManager } from '../core/FileManager';
import { Importer } from '../core/Importer';

const r = Router();
const m = new Importer();

r.use('/api/album', new AlbumController().router);
r.use('/api/photo', new PhotoController().router);

r.get('/api/index', async (req, res) => {
    try {
        await m.import();
        res.json({ success: true });
    } catch(e) {
        res.json({ success: false });
    }
})

r.get('/api/rewrite', async (req, res) => {
    try {
        const f = new FileManager();
        const media = await f.getMedia('Uncategorized');
        await f.writeExifData(media);

        res.json({ success: true });
    } catch(e) {
        console.log(e);
        res.json({ success: false });
    }
})

export default r;
