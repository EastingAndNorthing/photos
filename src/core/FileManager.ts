import { glob } from "glob";
import { getConfig } from "../config";
import path from "path"
import fs from "fs"
import { Point } from "../schema/PointSchema"
import { ExifHandler } from "./ExifHandler";

export type MediaSrc = {
    src: string,
    date: number
}

export type DirIndex = {
    albums: string[],
    media: MediaSrc[]
}

export type Media = {
    src: string,
    title: string,
    date: number,
    metadata: any,
    latitude?: number,
    longitude?: number,
    location?: Point
}


export class FileManager {

    private baseDir = './storage';

    private blacklist = ['.DS_Store', '.json'];

    private exifHandler = new ExifHandler();

    private initialized = false;

    constructor() {
        this.baseDir = getConfig('dataPath')
    }

    async init() {
        if (!this.initialized) {
            this.exifHandler = new ExifHandler();
            await this.exifHandler.init();
        }
    }
    
    async getMedia(dirName: string = '') : Promise<Media[]>{
        // const index = this.index();
        const media = await this.parse(dirName);

        return media;
    }

    async writeExifData(media: Media[]) {
        this.exifHandler.write(media);
    }

    async getAlbums(dirName: string = '') {
        return (await fs.promises
            .readdir(path.join(this.baseDir, dirName), { withFileTypes: true }))
            .filter(f => f.isDirectory())
            .map(d => d.name)
    }

    private async index(dirName: string = '') : Promise<MediaSrc[]> {

        console.time(`Indexing ${dirName}`);

        // const files: string[] = glob.sync(path.join(this.baseDir, dirName, '**/*'))
        const files: string[] = 
            glob.sync(path.join(this.baseDir, dirName, '*'))

        const media: MediaSrc[] = files
            .filter(f => {
                const ext = path.extname(f)
                return ext !== '' && !this.blacklist.includes(ext)
            })
            .map(src => ({
                src: src,
                date: fs.statSync(src).birthtime.getTime(),
            }))

        console.timeEnd(`Indexing ${dirName}`);

        return media;

    }

    private async parse(dirName: string = '') : Promise<Media[]> {

        const sources = await this.index(dirName);
        const media = await this.exifHandler.parse(sources);

        return media;

    }


}
