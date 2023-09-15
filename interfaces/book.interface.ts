import mongoose from "mongoose"

export interface IBook{
    name?: string,
    description?: string,
    page?: number,
    price?: number,
    quantity?: number,
    discount?: number,
    imageUrl?: string,
    language?: string,
    publisher?: mongoose.Types.ObjectId,
    author?: mongoose.Types.ObjectId,
    category?: mongoose.Types.ObjectId
}