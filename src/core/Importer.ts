import fs from "fs"
import path from "path"
import { getConfig } from "../config"
import { AlbumController } from "../controller/AlbumController";
import { PhotoController } from "../controller/PhotoController";
import AlbumModel from "../model/Album.model";


export class Importer {

    baseDir = './';

    constructor(baseDir: string) {
        this.baseDir = baseDir;
    }

    public async findAlbums() {
        return await fs.promises.readdir(this.baseDir);
    }

    public async import(albumName: string) {

        // const photoDB = await PhotoDB.getInstance();

        const rawAlbum = await this.parseRawAlbum(albumName);
        const album = await this.getAlbum(rawAlbum);

        console.log(album);
        
        for (const photo of rawAlbum.photos) {
            const photoDoc = await PhotoController.create({
                title: photo.title,
                description: photo.description,
                date: new Date(rawAlbum.self.date.timestamp * 1000),
                location: {
                    type: 'Point',
                    coordinates: [
                        photo.geoData.longitude,
                        photo.geoData.latitude,
                    ]
                },
                album: album,
                views: photo.imageViews,
            });

            const updated = await AlbumModel.findOneAndUpdate({ _id: album._id }, 
                { $push: { 'photos': photoDoc._id }
            }, { new: true });
        }

    }

    public async getAlbum(rawAlbum: any) {

        let album: any = await AlbumController.findOne({ title: rawAlbum.self.title });

        console.log('a', album);

        if (!album) {
            album = await AlbumController.create({
                title: rawAlbum.self.title,
                description: rawAlbum.self.description,
                date: new Date(rawAlbum.self.date.timestamp * 1000),
                photos: [],
            })
        }

        console.log(album);

        return album;
    }

    private async parseRawAlbum(albumName: string) {

        const albumDir = path.join(this.baseDir, albumName);
        const allFiles = await fs.promises.readdir(albumDir);
        
        const jsonFiles = allFiles.filter(file => 
            file.endsWith('json') && file !== 'metadata.json'
        );

        let parsed: any[] = [];

        for (const file of jsonFiles) {
            const buffer = await fs.promises.readFile(path.join(albumDir, file));
            parsed.push(JSON.parse(buffer.toString()));
        }

        const meta = await fs.promises.readFile(path.join(albumDir, 'metadata.json'));

        return {
            self: JSON.parse(meta.toString()),
            photos: parsed
        }
    }
}
