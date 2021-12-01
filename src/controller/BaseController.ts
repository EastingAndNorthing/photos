import { Router, Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import { Album } from "../model/Album.model";

export class BaseController {

    router: Router;
    model: Model<any>;

    constructor(model: Model<any>) {
        this.router = Router();
        this.model = model;

        this.router.get('/', this.findAll.bind(this));
        this.router.get('/:id', this.findOne.bind(this));
        this.router.get('/:id/delete', this.delete.bind(this));
    }

    async findAll(req: Request, res: Response) {
        res.json(await this.model.find()) // .populate('album')
    }

    async findOne(req: Request, res: Response) {
        res.json(await this.model.findOne({ _id: req.params.id }))
    }

    async find(req: Request, res: Response) {
        // res.json(await this.model.find(criteria));
        res.json({ error: 'Not yet implemented' })
    }

    async delete(req: Request, res: Response) {
        res.json(await this.model.findOneAndDelete({ _id: req.params.id }))
    }
    
}
