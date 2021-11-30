import { IAlbum } from '../model/Album.model';
import Photo, { IPhoto } from '../model/Photo.model';
import { Point } from '../schema/PointSchema';

export class PhotoController {

    static async find(criteria: any) {
        return await Photo.find(criteria)
    }

    static async findOne(criteria: any) {
        return await Photo.findOne(criteria)
    }

    static async findAll() {
        return await Photo.find();
    }

    // @TODO use IPhoto without the Document extension meuk
    static async create(photo: {
        title: string;
        description: string;
        date: Date;
        location?: Point,
        album?: IAlbum[];
        views?: number,
    }) {

        if(photo.location?.coordinates[0] == 0 && photo.location?.coordinates[1] == 0)
            delete photo.location
            // photo.location = undefined;

        return await Photo.create(photo);

    }

}
