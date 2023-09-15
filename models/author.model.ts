import mongoose, { Schema, mongo } from "mongoose";
import IAuthor from "../interfaces/author.interface";

const authorSchema = new Schema<IAuthor>({
    name: {
        type: String,
        trim: true,
        required: true
    },
    info: {
        type: String,
        trim: true
    }
}, {timestamps: true})

export const Author = mongoose.model<IAuthor>('Author', authorSchema)