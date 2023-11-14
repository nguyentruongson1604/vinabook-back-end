import { NextFunction, Request, Response } from "express";
import {Book} from '../models/book.model'
import { IBook } from "../interfaces/book.interface";
import path from "path";
import mongoose from "mongoose";

export async function getAllBook(req: Request, res: Response, next: NextFunction) {
    try {
        const {page, limit} = req.query;
        const totalResults = await Book.find({})
        const listBook = await Book.find({})
        .populate('author', 'name')
        .populate('publisher', 'name')
        .populate('category', 'name')
        .sort({'createdAt': -1})
        .limit(+limit!)
        .skip((+page! - 1) * +limit!)
        
        res.status(200).json({
            status: 'success',
            length: listBook.length,
            page: Math.ceil(totalResults.length / +limit!) ,
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
        const {page, limit} = req.query;
        const filter = {author: {_id: authorId}}
        const totalResults = await Book.find(filter)
        const listBookByAuthor = await Book.find(filter)
        .populate('author', 'name')
        .populate('publisher', 'name')
        .populate('category', 'name')
        .limit(+limit!)
        .skip((+page! - 1) * +limit!)
        res.status(200).json({
            status: 'success',
            length: listBookByAuthor.length,
            page: Math.ceil(totalResults.length / +limit!) ,
            data: listBookByAuthor
        })
    } catch (error) {
        next(error)
    }
}

export async function getBookByCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const {page, limit} = req.query;
        const {categoryId} = req.params
        const filter = {category: {_id: categoryId}}
        const totalResults = await Book.find(filter)
        const listBook = await Book.find(filter)
        .populate('author', 'name')
        .populate('publisher', 'name')
        .populate('category', 'name')
        .limit(+limit!)
        .skip((+page! - 1) * +limit!)
        res.status(200).json({
            status: 'success',
            page: Math.ceil(totalResults.length / +limit!) ,
            data: listBook
        })
    } catch (error) {
        next(error)
    }
}

export async function getBookByPublisher(req: Request, res: Response, next: NextFunction) {
    try {
        const {page, limit} = req.query;
        const {publisherId} = req.params
        const filter = {publisher: {_id: publisherId}}
        const totalResults = await Book.find(filter)
        const listBook = await Book.find(filter)
        .populate('author', 'name')
        .populate('publisher', 'name')
        .populate('category', 'name')
        .limit(+limit!)
        .skip((+page! - 1) * +limit!)
        res.status(200).json({
            status: 'success',
            page: Math.ceil(totalResults.length / +limit!) ,
            data: listBook
        })
    } catch (error) {
        next(error)
    }
}

export async function searchBooks(req: Request, res: Response, next: NextFunction) {
    try {
        let {keyword, page, limit} = req.query;
        // limit = limit?.toString().replace('/', '');
        // console.log({page, limit})

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
                        {'publisher.name': {$regex: keyword, $options: 'i'}},
                        {'category.name': {$regex: keyword, $options: 'i'}}
                    ]
                }
            }
        ])      
        .skip((+page - 1) * (+limit))
        .limit(+limit)

        const totalResults = await Book.aggregate([
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
                        {'publisher.name': {$regex: keyword, $options: 'i'}},
                        {'category.name': {$regex: keyword, $options: 'i'}}
                    ]
                }
            }
        ])      
        
        // console.log(filterList)
        res.status(200).json({
            status: 'success',
            length: filterList.length,
            page: Math.ceil(totalResults.length / +limit!),
            data: filterList
        })
    } catch (error) {
        next(error);
        // res.status(400).json({
        //     error: error
        // })
    }
}
