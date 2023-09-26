import { Request, Response, NextFunction } from "express";
import { Category } from "../models/category.model";
import { ICategory } from "../interfaces/category.interface";

export async function newCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const newCategory = await Category.create(req.body);
        console.log(req.query)
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
        const listCategory = await Category.find({}).select('name');
        res.status(200).json({
            status: 'success',
            length: listCategory.length,
            allCategory: listCategory
        })
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
