import { Router, Request, Response } from 'express';
import { Album, IAlbum } from '../model/Album.model';
import { Photo, IPhoto } from '../model/Photo.model';
import { Point } from '../schema/PointSchema';
import { BaseController } from './BaseController';

export class PhotoController extends BaseController {

    constructor() {
        super(Photo);
    }

    async findOne(req: Request, res: Response) {
        res.json(await this.model.findOne({ _id: req.params.id }).populate('album'))
    }

    async findAll(req: Request, res: Response) {
        res.json(await this.model.find().sort({ date: -1 }).populate('album'))
    }

    // @TODO use IPhoto without the Document extension meuk
    static async create(photo: IPhoto) : Promise<IPhoto> {

        if(photo.location?.coordinates[0] == 0 && photo.location?.coordinates[1] == 0)
            delete photo.location

        return await Photo.create(photo);

    }

}
