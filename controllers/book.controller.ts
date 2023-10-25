import { NextFunction, Request, Response } from "express";
import {Book} from '../models/book.model'
import { IBook } from "../interfaces/book.interface";
import path from "path";
import mongoose from "mongoose";

export async function getAllBook(req: Request, res: Response, next: NextFunction) {
    try {
        const listBook = await Book.find({}).populate('author', 'name').populate('publisher', 'name').populate('category', 'name')
        res.status(200).json({
            status: 'success',
            length: listBook.length,
            data: listBook
        })
    } catch (error) {
        next(error)
    }
}

export async function newBook(req: Request, res: Response, next: NextFunction) {
    try {
        const book = req.body as IBook;
        if(book.imageUrl){
            book.imageUrl = 'http://localhost:5000/images/books/null'
        }
        const newBook = await Book.create(book)
        res.status(200).json({
            status: "success",
            data: newBook
        })
    } catch (error) {
        next(error);
    }
}

export async function uploadBookImage(req: any, res: Response, next: NextFunction) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        else{
            // console.log('image: ', req.file)
            const imgUrl = 'http://localhost:5000/images/books/' + req.file.filename
            // console.log(imgUrl)
            const bookId = req.params.bookId
            await Book.findByIdAndUpdate(bookId, {imageUrl: imgUrl});
            return res.status(200).json({ message: 'File uploaded successfully!' });
        }
    } catch (error) {
        next(error)
    }
}

export async function getBookById(req: Request, res: Response, next: NextFunction) {
    try {
        const {bookId} = req.params;
        // console.log(bookId)
        const book = await Book.findById(new mongoose.Types.ObjectId(bookId)).populate('author', 'name').populate('publisher', 'name').populate('category', 'name')
        res.status(200).json({
            status: 'success',
            data: book
        })
    } catch (error) {
        next(error);
    }
}

export async function updateBook(req: Request, res: Response, next: NextFunction) {
    try {
        const {bookId} = req.params;
        const book = req.body as IBook
        const updatedBook = await Book.findByIdAndUpdate(bookId, book, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'updated',
            data: updatedBook
        })
    } catch (error) {
        next(error);
    }
}

export async function deleteBook(req: Request, res: Response, next: NextFunction) {
    try {
        const {bookId} = req.params;
        await Book.findByIdAndDelete(bookId)
        res.status(200).json({
            status: 'deleted',
        })
    } catch (error) {
        next(error);
    }
}

export async function getBookByAuthor(req: Request, res: Response, next: NextFunction) {
    try {
        const {authorId} = req.params;
        const filter = {author: {_id: authorId}}
        const listBookByAuthor = await Book.find(filter).populate('author', 'name').populate('publisher', 'name').populate('category', 'name')
        res.status(200).json({
            status: 'success',
            data: listBookByAuthor
        })
    } catch (error) {
        next(error)
    }
}

export async function getBookByCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const {categoryId} = req.params
        const filter = {category: {_id: categoryId}}
        const listBook = await Book.find(filter).populate('author', 'name').populate('publisher', 'name').populate('category', 'name')
        res.status(200).json({
            status: 'success',
            data: listBook
        })
    } catch (error) {
        next(error)
    }
}

export async function getBookByPublisher(req: Request, res: Response, next: NextFunction) {
    try {
        const {publisherId} = req.params
        const filter = {publisher: {_id: publisherId}}
        const listBook = await Book.find(filter).populate('author', 'name').populate('publisher', 'name').populate('category', 'name')
        res.status(200).json({
            status: 'success',
            data: listBook
        })
    } catch (error) {
        next(error)
    }
}

export async function searchBooks(req: Request, res: Response, next: NextFunction) {
    try {
        let {keyword, page, limit} = req.query;
        limit = limit?.toString().replace('/', '');
        // console.log('query',req.query)

        if (!page || !limit) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing page or limit parameters.'
            });
        }

        const filterList = await Book.aggregate([
            {
                $lookup: {
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $lookup: {
                    from: 'publishers',
                    localField: 'publisher',
                    foreignField: '_id',
                    as: 'publisher'
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$author'
            },
            {
                $unwind: '$publisher'
            },
            {
                $unwind: '$category'
            },
            {
                $match: {
                    $or: [
                        {'name': {$regex: keyword, $options: 'i'}},
                        {'author.name': {$regex: keyword, $options: 'i'}},
                        {'publsher.name': {$regex: keyword, $options: 'i'}},
                        {'category.name': {$regex: keyword, $options: 'i'}}
                    ]
                }
            },
            {
                $limit: parseInt(limit),
            },
            {
                $skip: (+page - 1) * +limit
            }
        ])
        
        res.status(200).json({
            status: 'success',
            length: filterList.length,
            data: filterList
        })
    } catch (error) {
        next(error);
        // res.status(400).json({
        //     error: error
        // })
    }
}
