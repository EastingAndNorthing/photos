import { Router, Request, Response } from "express";
import { Photo } from "../model/Photo.model";
import { Album } from "../model/Album.model";
import { Point } from "../schema/PointSchema";
import path from "path"
import fs from "fs"
import { FileManager } from "./FileManager";

export class Importer {

    baseDir = './';

    f = new FileManager();

    constructor(baseDir?: string) {
        if (baseDir) this.baseDir = baseDir;
    }
    
    public async import() {
        
        await this.f.init();
        const albums = await this.f.getAlbums(this.baseDir);

        for (const album of albums) {
            let albumDoc: any = await Album.findOne({ title: album });
                        
            if (!albumDoc) {
                albumDoc = await Album.create({
                    title: album,
                    description: '',
                    date: new Date(),
                })
            }

            this.deleteItemsInAlbum(albumDoc); // Force reload all

            const media = await this.f.getMedia(album);
            for (const item of media) {

                // @TODO should also delete photos if not in file list, how?
                let photoDoc: any = undefined // await Photo.findOne({ src: item.src });

                if (!photoDoc) {
                    photoDoc = await Photo.create({
                        src: item.src,
                        title: item.title,
                        description: '',
                        date: new Date(item.date),
                        album: albumDoc,
                        location: item.location
                    });
                }

                // const updated = await AlbumModel.findOneAndUpdate({ _id: album._id }, 
                //     { $push: { 'photos': doc._id }
                // }, { new: true });
            }
        }

    }

    private async deleteItemsInAlbum(album: any) {

        if (!album || !album._id)
            return;
        
        for (const p of await Photo.find({ album }))
            await p.delete();
        
        // await Album.findOneAndDelete({ title: album.title });
    }

}
