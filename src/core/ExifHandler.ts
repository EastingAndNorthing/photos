import { MediaSrc, Media } from "./FileManager"
import path from "path";

const exiftool = require('node-exiftool')

export class ExifHandler {

    exif: any;
    
    private exifTags = [
        // '-File:all',
        "c '%.7f'",     // Decimal precision, used in latlng
        'CreateDate',
        'ModifyDate',
        'ImageDescription',
        'GPSLatitude',
        'GPSLongitude',
        'GPSPosition',
        'GPSCoordinates',
        'GPSAltitude',
        'ExifImageWidth',
        'ExifImageHeight',
        'Orientation',
        'Model',
        'Duration'
    ];

    private initialized = false;

    constructor() {}

    async init() {
        if (!this.initialized) {
            this.exif = new exiftool.ExiftoolProcess()
            const pid = await this.exif.open()
            console.log(`Started exiftool process pid ${pid}`)
        }
    }

    async destruct() {
        if (this.initialized)
            this.exif.close();
    }

    async parse(imagelist: MediaSrc[]) : Promise<Media[]> {

        await this.init()
        
        console.time('Building exif database')
        console.log('Building exif database')

        let media: Media[] = []
        
        for (const i in imagelist) {

            const img = imagelist[i];

            const res: any = await this.exif.readMetadata(img.src, this.exifTags)

            if (res.error)
                console.error(res.error)

            const date = this.parseDate(res.data[0].CreateDate);

            const m: Media = {
                src: img.src,
                title: path.basename(img.src),
                date: date > 0 ? date : img.date,
                metadata: res.data[0],
                location: undefined,
                latitude: undefined,
                longitude: undefined
            }

            if (m.metadata.GPSLatitude && m.metadata.GPSLongitude) {
                m.latitude = parseFloat(m.metadata.GPSLatitude.split("'")[1]);
                m.longitude = parseFloat(m.metadata.GPSLongitude.split("'")[1]);
                m.location = {
                    type: 'Point',
                    coordinates: [
                        m.longitude,
                        m.latitude,
                    ]
                }
            }

            media.push(m)

            // const p = Math.round(Number(i) / files.length * 100)
            // if (p % 10 == 0) console.log(`${p}%`)
        }

        console.timeEnd('Building exif database')

        return media;

    }

    public write(media: MediaSrc[]) {
        
        console.time('Writing EXIF tags')
        for (const m of media) {
            // ep.writeMetadata(file:string, data:object, args:array)
            this.exif.writeMetadata(m.src, {
                comment: 'Exiftool rules!',
                'Keywords+': [ 'keywordA', 'keywordB' ], 
            }, ['overwrite_original'])
        }
        console.timeEnd('Writing EXIF tags')
    }
    
    private parseDate(date: string) {
        if (!date || date == '')
            return 0;

        const str = date.split(' ')
        const dateStr = str[0].replace(/:/g, '-')
        const properDateStr = dateStr + ' ' + str[1]
        
        return new Date(properDateStr).getTime()
    }
    

}