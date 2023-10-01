import { NextFunction, Request, Response } from "express";
import { Publisher } from "../models/publisher.model";
import { IPublisher } from "../interfaces/publisher.interface";

export async function newPublisher(req: Request, res: Response, next: NextFunction) {
    try {
        const newPublisher = await Publisher.create(req.body);
        res.status(200).json({
            status: 'success',
            data: newPublisher
        })
    } catch (error) {
        next(error);
    }
}

export async function allPublisher(req: Request, res: Response, next: NextFunction) {
    try {
        const listPublisher = await Publisher.find({}).select("name");
        console.log(listPublisher)
        res.status(200).json({
            status: 'success',
            length: listPublisher.length,
            data: listPublisher
        })
    } catch (error) {
        next(error);
    }
}

export async function updatePublisher(req: Request, res: Response, next: NextFunction) {
    try {
        const {publisherId} = req.params;
        const publisher = req.body as IPublisher
        const updatedPublisher = await Publisher.findByIdAndUpdate(publisherId, publisher, {
            new: true,
            runValidators: true
        })
        
        res.status(200).json({
            status: 'success',
            date:{
                message: 'updated publisher',
                data: updatedPublisher
            }
        })
        
    } catch (error) {
        next(error)
    }
}

export async function deletePublisher(req: Request, res: Response, next: NextFunction) {
    try {
        const publisherId = req.params;
        await Publisher.findByIdAndDelete(publisherId.publisherId)
        
        res.status(200).json({
            status: 'deleted'
        })
        
    } catch (error) {
        next(error)
    }
}