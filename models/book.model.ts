import mongoose, { Schema } from "mongoose";
import { IBook } from "../interfaces/book.interface";

const bookSchema = new Schema<IBook>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    page: {
        type: Number,
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    imageUrl: {
        type: String,
        required: true,
    },
    language: {
        type: String,
    },
    publisher: {
        type: Schema.Types.ObjectId,
        ref: 'Publisher'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }

})

export const Book = mongoose.model<IBook>('Book', bookSchema)