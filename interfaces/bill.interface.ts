import mongoose from "mongoose"

export interface IBill {
    owner?: mongoose.Types.ObjectId,
    name?: string,
    books?: IBooksInBill[],
    phone?: string,
    address?: string,
    totalCost?: number,
    status?: string
}

export interface IBooksInBill{
    bookId: mongoose.Schema.Types.ObjectId,
    price: number,
    quantity: number,
    discount: number
}