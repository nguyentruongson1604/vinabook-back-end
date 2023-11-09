import { NextFunction, Request, Response } from "express";
import { Publisher } from "../models/publisher.model";
import { IPublisher } from "../interfaces/publisher.interface";
import { Book } from "../models/book.model";
import { Author } from "../models/author.model";

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
        const {page, limit} = req.query;
        const totalResults = await Publisher.find({})
        const listPublisher = await Publisher.find({})
        .select("name")
        .limit(+limit!)
        .skip((+page! - 1) * +limit!);
        // console.log(listPublisher)
        res.status(200).json({
            status: 'success',
            length: listPublisher.length,
            page: Math.floor(totalResults.length / +limit!) + 1,
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

export async function getPublisherByCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const {page, limit} = req.query;
        const {categoryId} = req.params
        const filter = {category: {_id: categoryId}}
        const publishersByCategory = await Book.find(filter).distinct('publisher')
        const totalResults = await Publisher.find({
            _id: {
                $in: [...publishersByCategory]
            }
        })
        const publishers = await Publisher.find({
            _id: {
                $in: [...publishersByCategory]
            }
        })
        .limit(+limit!)
        .skip((+page! - 1) * +limit!)
        res.status(200).json({
            status: 'success',
            page: Math.floor(totalResults.length / +limit!) + 1,
            data: publishers
        })
    } catch (error) {
        next(error)
    }
}

export async function getPublisherById(req: Request, res: Response, next: NextFunction) {
    try {
        const {publisherId} = req.params
        const publisher = await Publisher.findById(publisherId).select('name info');
        res.status(200).json({
            status: 'success',
            data: publisher
        })
    } catch (error) {
        next(error);
    }
}