import { Router, Request, Response } from 'express';
import { Album, IAlbum } from '../model/Album.model';
import { Photo, IPhoto } from '../model/Photo.model';
import { BaseController } from './BaseController';

export class AlbumController extends BaseController {

    constructor() {
        super(Album);
    }

    // @TODO use IAlbum without the Document extension meuk
    async create(album: IAlbum) {
        return await Album.create(album);
    }

}
