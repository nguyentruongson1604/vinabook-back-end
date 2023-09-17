import mongoose from "mongoose";

export interface ICart{
    owner?: mongoose.Types.ObjectId,
    listBook?: IBookInCart[],
    totalCost?: number
}

export interface IBookInCart{
    bookId?: mongoose.Types.ObjectId,
    quantity: number
}