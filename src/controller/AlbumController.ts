import Album, { IAlbum } from '../model/Album.model';
import { IPhoto } from '../model/Photo.model';

export class AlbumController {

    static async find(criteria: any) {
        return await Album.find(criteria)
    }

    static async findOne(criteria: any) {
        return await Album.findOne(criteria)
    }

    static async findAll() {
        return await Album.find();
    }
    
    // @TODO use IAlbum without the Document extension meuk
    static async create(album: {
        title: string;
        description: string;
        date: Date;
        photos?: IPhoto[];
    }) {

        console.log(album);

        return await Album.create(album);

            // .then((data: IAlbum) => {
            //     return data;
            // })
            // .catch((error: Error) => {
            //     throw error;
            // });
    }

}
