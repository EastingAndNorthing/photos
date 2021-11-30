import mongoose, { Schema, Document } from 'mongoose';
import { Point, PointSchema } from '../schema/PointSchema';
import { IAlbum } from './Album.model';

export interface IPhoto extends Document {
    title: string;
    description: string;
    date: Date;
    location: Point;
    album: IAlbum;
}

const PhotoSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    date: { type: Date, required: false },
    location: PointSchema,
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album'
    },
    views: { type: Number, required: false }
});

export default mongoose.model<IPhoto>('Photo', PhotoSchema);