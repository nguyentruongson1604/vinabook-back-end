import mongoose, { Schema } from "mongoose";
import { ICategory } from "../interfaces/category.interface";

const categorySchema = new Schema<ICategory>({
    name: {
        type: String,
        required: true
    }
},{timestamps: true})

export const Category = mongoose.model<ICategory>("Category", categorySchema)