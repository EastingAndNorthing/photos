import mongoose, { Schema, Document } from 'mongoose';
// import { IPhoto } from './Photo.model';

export interface IAlbum extends Document {
    title: string;
    description: string;
    date: Date;
    // photos: IPhoto[];
}

const AlbumSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    date: { type: Date, required: false },
    // photos: [{
    //   type: Schema.Types.ObjectId,
    //   ref: 'Photo'
    // }],
});

export const Album = mongoose.model<IAlbum>('Album', AlbumSchema);