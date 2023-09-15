import mongoose from "mongoose"

export interface IBill {
    owner?: mongoose.Types.ObjectId,
    book?: IBooksInBill[],
    phone?: string,
    address?: string,
    totalCost?: string
}

export interface IBooksInBill{
    bookId: mongoose.Types.ObjectId,
    quantity: number,
    price: number
}