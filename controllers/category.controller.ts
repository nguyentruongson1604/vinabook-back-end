import { Request, Response, NextFunction } from "express";
import { Category } from "../models/category.model";
import { ICategory } from "../interfaces/category.interface";
import { Book } from "../models/book.model";
import { Author } from "../models/author.model";
import { Publisher } from "../models/publisher.model";

export async function newCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const newCategory = await Category.create(req.body);
        // console.log(req.query)
        res.status(200).json({
            status: 'success',
            data: newCategory,
        })
    } catch (error) {
        next(error);
    }
}

export async function getAllCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const {page, limit} = req.query;
        const totalResults = await Category.find({})
        const listCategory = await Category.find({})
        .select(['name', 'createdAt'])
        .limit(+limit!)
        .skip((+page! - 1) * +limit!);
        res.status(200).json({
            status: 'success',
            length: listCategory.length,
            page: Math.ceil(totalResults.length / +limit!),
            allCategory: listCategory
        })
    } catch (error) {
        next(error);
    }
}

export async function getAllCategoryAndRelation(req: Request, res: Response, next: NextFunction) {
    try {
        const listCategory = await Category.find({}).select('name');
        const categoryWithAuthors = await Promise.all(listCategory.map(async (category) => {
        const listBook = await Book.find({ category: category._id });
        const authorIds = [...new Set(listBook.map(book => book.author))];
        const publisherIds = [...new Set(listBook.map(book => book.publisher))];
        const authors = await Author.find({ _id: { $in: authorIds } }).select('name');
        const publishers = await Publisher.find({_id: {$in: publisherIds}}).select('name');

        return {
            ...category.toObject(),
            authors,
            publishers,
            books: listBook.length
        };
    }));

        res.status(200).json({
            status: 'success',
            length: listCategory.length,
            allCategory: categoryWithAuthors,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const {categoryId} = req.params;
        const category = req.body as ICategory;
        const categoryUpdated = await Category.findByIdAndUpdate(categoryId, category, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: "success",
            data:{
                message: 'updated',
                data: categoryUpdated
            }
        })
    } catch (error) {
        next(error);
    }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const {categoryId} = req.params;
        await Category.findByIdAndDelete(categoryId);
        res.status(200).json({
            status: "deleted",
        })
    } catch (error) {
        next(error);
    }
}

export async function getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
        const {categoryId} = req.params
        const category = await Category.findById(categoryId).select('name');
        res.status(200).json({
            status: 'success',
            data: category
        })
    } catch (error) {
        next(error)
    }
}