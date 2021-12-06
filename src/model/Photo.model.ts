import mongoose, { Schema, Document } from 'mongoose';
import { Point, PointSchema } from '../schema/PointSchema';
import { IAlbum } from './Album.model';

export interface IPhoto extends Document {
    title: string;
    src: string,
    description: string;
    date: Date;
    location?: Point;
    album?: IAlbum;
}

const PhotoSchema: Schema = new Schema({
    title: { type: String, required: true },
    src: { type: String, required: true },
    description: { type: String, required: false },
    date: { type: Date, required: false },
    location: PointSchema,
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album'
    },
    views: { type: Number, required: false }
});

export const Photo = mongoose.model<IPhoto>('Photo', PhotoSchema);