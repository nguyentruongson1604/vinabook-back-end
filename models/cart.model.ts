import mongoose, { Schema } from "mongoose";
import { IBookInCart, ICart } from "../interfaces/cart.interface";

const booksInCartSchema = new Schema<IBookInCart>({
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        unique: false
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
})

const cartSchema = new Schema<ICart>({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    listBook: {
        type: [booksInCartSchema],
    }
})

export const Cart = mongoose.model<ICart>('Cart', cartSchema)