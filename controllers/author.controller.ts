import { NextFunction, Request, Response } from "express";
import {Author} from '../models/author.model'
import IAuthor from "../interfaces/author.interface";

export async function newAuthor(req: Request, res: Response, next: NextFunction) {
    try {
        const author = await Author.create(req.body)
        res.status(200).json({
            status: 'success',
            data: author
        })
    } catch (error) {
        next(error);
    }
}

export async function getAllAuthor(req: Request, res: Response, next: NextFunction) {
    try {
        const listAuthor = await Author.find({}).select(['name', 'info', 'createdAt']);
        res.status(200).json({
            status: "success",
            length: listAuthor.length,
            data: listAuthor
        })
    } catch (error) {
        next(error);
    }
}

export async function updateAuthor(req: Request, res: Response, next: NextFunction) {
    try {
        const {authorId} = req.params;
        const author = req.body as IAuthor;
        const updatedAuthor = await Author.findByIdAndUpdate(authorId, author, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: "updated",
            data: updatedAuthor
        })
    } catch (error) {
        next(error);
    }
}

export async function deleteAuthor(req: Request, res: Response, next: NextFunction) {
    try {
        const {authorId} = req.params
        await Author.findByIdAndDelete(authorId);
        res.status(200).json({
            status: 'deleted'
        })
    } catch (error) {
        next(error);
    }
}

export async function getAuthorById(req: Request, res: Response, next: NextFunction) {
    try {
        const {authorId} = req.params
        const author = await Author.findById(authorId);
        res.status(200).json({
            status: 'deleted',
            data: author
        })
    } catch (error) {
        next(error);
    }
}