import mongoose, { Schema } from "mongoose";
import { IBill, IBooksInBill } from "../interfaces/bill.interface";

const booksInBillSchema = new Schema<IBooksInBill>({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Book'
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    price:{
        type: Number,
        required: true
    }
})

const billSchema = new Schema<IBill>({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    book: [booksInBillSchema],
    name: {
        type: String,
        trim: true,
        required: true,
    },
    phone: {
        type: String,
        trim: true,
        required: true,
    },
    address:{
        type: String,
        trim: true,
        required: true
    },
    totalCost:{
        type: Number,
        required: true
    }
}, {timestamps: true})

export const Bill = mongoose.model<IBill>('Bill', billSchema)