import fs from "fs"
import path from "path"
import { Photo } from "../model/Photo.model";
import { Album } from "../model/Album.model";
import { Point } from "../schema/PointSchema";

export class Importer {

    baseDir = './';

    constructor(baseDir: string) {
        this.baseDir = baseDir;
    }

    public async findAlbums() {
        return (await fs.promises.readdir(this.baseDir, { withFileTypes: true }))
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)

        // return await fs.promises.readdir(this.baseDir);
    }

    public async import(albumName: string, deleteExisting = false) {

        const rawAlbum = await this.readJSON(albumName);

        let album: any = await Album.findOne({ title: rawAlbum.self.title });

        if (deleteExisting) {
            await this.delete(album);
            album = undefined;
        }
        
        if (!album) {
            album = await Album.create({
                title: rawAlbum.self.title,
                description: rawAlbum.self.description,
                date: new Date(rawAlbum.self.date.timestamp * 1000),
                photos: [],
            })
        }
        
        for (const photo of rawAlbum.photos) {

            let p: any = {
                title: photo.title,
                description: photo.description,
                date: new Date(photo.photoTakenTime.timestamp * 1000),
                album: album,
                views: photo.imageViews,
                location: undefined
            }

            if(photo.geoData.longitude > 0 && photo.geoData.latitude > 0) {
                p.location = {
                    type: 'Point',
                    coordinates: [
                        photo.geoData.longitude,
                        photo.geoData.latitude,
                    ]
                }
            }

            const doc = await Photo.create(p);

            // const updated = await AlbumModel.findOneAndUpdate({ _id: album._id }, 
            //     { $push: { 'photos': doc._id }
            // }, { new: true });
        }

        console.log(album);
        console.log({ photos: rawAlbum.photos.length });

    }

    private async delete(album: any) {

        if (!album || !album._id)
            return;
        
        for (const p of await Photo.find({ album: album }))
            await p.delete();
        
        await Album.findOneAndDelete({ title: album.title });
    }

    private async readJSON(albumName: string) {

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
