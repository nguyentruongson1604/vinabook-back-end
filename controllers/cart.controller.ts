import {  Request, Response, NextFunction } from "express";
import { Cart } from "../models/cart.model";
import mongoose from "mongoose";
import { IBookInCart, ICart } from "../interfaces/cart.interface";
import { IRequest } from "../interfaces/request.interface";

export async function getAllCart(req: IRequest, res: Response, next: NextFunction) {
    try {
        const carts = await Cart.find({}).select('listBook owner')
        .populate('listBook.bookId', 'name price discount')
        .populate('owner', 'name');

        const result = carts.map((cart: any)=>{
            let total = 0;
            cart.listBook?.map((book: any)=>{
                // console.log(book)
                total += book.quantity * (+book.bookId?.price - +book.bookId?.price * +book.bookId?.discount / 100)
            })
            return {...cart._doc, totalCost: total}
        })

        res.status(200).json({
            status: 'success',
            length: carts.length,
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export async function getCartByUserId(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId;
        const checkCart = await Cart.find({owner: {_id: new mongoose.Types.ObjectId(userId)}})
        if(checkCart.length > 0){
            const cart = await checkCart[0].populate('listBook.bookId', 'name imageUrl price discount')
            if(cart.listBook?.length){
                // console.log('cart', cart.listBook?.length)
                res.status(200).json({
                    status: 'get success',
                    length: cart.listBook.length,
                    data: cart                    
                })
            }
            else{
                // console.log('cart', cart.listBook?.length)
                res.status(200).json({
                    status: 'cart empty',
                })
            }
        }
        else{
            res.status(404).json({
                status: 'cart is not exist'
            })
        }
    } catch (error) {
        next(error)
    }
}

export async function getCart(req: IRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const checkCart = await Cart.find({owner: {_id: new mongoose.Types.ObjectId(userId)}})
        if(checkCart.length > 0){
            const cart = await checkCart[0].populate('listBook.bookId', 'name imageUrl price discount quantity')
            // console.log('cart', cart)
            if(cart.listBook){
                // console.log('cart', cart.listBook?.length)
                res.status(200).json({
                    status: 'get success',
                    length: cart.listBook.length,
                    data: cart                    
                })
            }
        }
        else{
            const newCart = await createCart(userId!, next)
            res.status(200).json({
                status: 'get success',
                length: newCart?.listBook?.length,
                data: newCart                    
            })
        }
    } catch (error) {
        next(error)
    }
}

export async function initCartFromLocal(req: IRequest, res: Response, next: NextFunction) {
    try {
        const listBookLocal = req.body.listBook
        const userId = req.userId;
        const checkCart = (await Cart.findOne({owner: {_id: new mongoose.Types.ObjectId(userId)}}))
        // console.log('cart', checkCart)
        if(checkCart){
            const listBook = listBookLocal.map((book: any)=>{
                return {
                    bookId: book.bookId._id,
                    quantity: book.quantity
                }
            })

            const cart = await Cart.findByIdAndUpdate(checkCart, {listBook: listBook}, {
                    new: true,
                    runValidators: true
                }).populate('listBook.bookId', 'name imageUrl price discount quantity')

                res.status(200).json({
                    data: cart
                })
        }
        else{
            const newCart = await createCart(userId!, next)
            const listBook = listBookLocal.map((book: any)=>{
                return {
                    bookId: book.bookId._id,
                    quantity: book.quantity
                }
            })

            const cart = await Cart.findByIdAndUpdate(newCart, {listBook: listBook}, {
                    new: true,
                    runValidators: true
                }).populate('listBook.bookId', 'name price')

                res.status(200).json({
                    data: cart
                })
        }
        
    } catch (error) {
        next(error)
    }
}

export async function clearCart(req: IRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const checkCart = (await Cart.find({owner: {_id: new mongoose.Types.ObjectId(userId)}}))
        if(checkCart.length > 0){
            const cartId = checkCart[0]._id
            const cart = await Cart.findByIdAndUpdate(cartId, {listBook: [], totalCost: 0}, {
                new: true,
                runValidators: true
            })
            res.status(200).json({
                status: 'clear success, cart empty',
                data: cart
            })
        }
        else{
            res.status(404).json({
                status: "cart not exist"
            })
        }
    } catch (error) {
        next(error)
    }
}

function checkItemInCart(listBook: IBookInCart[], newBook: IBookInCart){
    const listBookId = listBook.map((book)=>{
        return book.bookId?.toString();
    })

    if(listBookId.indexOf(newBook.bookId?.toString()) > -1){
        return true
    }
    return false
}

async function createCart(userId: string, next: NextFunction) {
    try {
        const newCart = await Cart.create({
            owner: userId,
            listBook: []
        })
        // console.log("new cart in add cart", newCart)
        return newCart
    } catch (error) {
        next(error)
    }
}

async function addBook(cart: any, newBook: IBookInCart, next: NextFunction){
    try {
        const cartId = new mongoose.Types.ObjectId(cart._id)
        // console.log("cartId", cartId)
        let listBook = cart.listBook.slice()
        
        if(!checkItemInCart(listBook, newBook)){
            listBook = [...listBook, newBook]
            
            const books = await Cart.findByIdAndUpdate(cartId, {listBook: listBook}, {
                new: true,
                runValidators: true
            }).populate('listBook.bookId', 'name price')

            // console.log("book", books)
            return books
        }
        else{
            listBook.map((book: IBookInCart)=>{
                if(book.bookId?.toString() === newBook.bookId){
                    book.quantity += newBook.quantity ? +newBook.quantity : 1;
                    return book
                }
            })
            // console.log(listBook)
            const books = await Cart.findByIdAndUpdate(cartId, {listBook: listBook, totalCost: 0}, {
                new: true,
                runValidators: true
            }).populate('listBook.bookId', 'name price')

            return books
        }
    } catch (error) {
        next(error)
        // console.log(error)
    }
}

export async function addBookToCart(req: IRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const checkCart = await Cart.findOne({owner: {_id: new mongoose.Types.ObjectId(userId)}})
        // console.log({checkCart})
        const newBook = req.body
        let newListBook: (mongoose.Document<unknown, {}, ICart> & ICart & { _id: mongoose.Types.ObjectId; }) | null | undefined

        if(checkCart){
            newListBook = await addBook(checkCart, newBook, next)
        }
        else{
            const newCart = await createCart(userId!, next)
            // console.log("new cart", newCart)
            newListBook = await addBook(newCart, newBook, next)
            // console.log("create cart and add book", newListBook)
        }

        res.status(200).json({
            status: 'success',
            length: newListBook?.listBook?.length,
            data: newListBook            
        })
    } catch (error) {
        next(error)
    }
}

async function updateCart(userId: string, books: IBookInCart, next: NextFunction) {
    try {
        await Cart.findOneAndUpdate({owner: {_id: new mongoose.Types.ObjectId(userId)}}, {"listBook": books})
    } catch (error) {
        next(error)
    }
}

export async function deleteOneTypeBook(req: IRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const bookIdToRemove = req.body.bookId;

        const cart = await Cart.findOne({owner: {_id: new mongoose.Types.ObjectId(userId)}})
        .populate('listBook.bookId', 'name')
        .exec()
        .then((res: any)=>{
            const books = res.listBook.filter((book: any)=>{
                return book.bookId._id.toString() !== bookIdToRemove
            })
            return books
        })

        if(cart){
            updateCart(userId!, cart, next)
            res.status(200).json({
                status: 'delete success',
                length: cart.length,
                data: cart
            })
        }
        else{
            res.status(404).json({
                status: 'not found'
            })
        }
    } catch (error) {
        next(error)
    }
}

export async function removeOneBook(req: IRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const bookIdToRemove = req.query.bookId;

        const cart = await Cart.findOne({owner: {_id: new mongoose.Types.ObjectId(userId)}})
        .populate('listBook.bookId', 'name')
        .exec()
        .then((res: any)=>{
            const books = res.listBook.map((book: any)=>{
                if(book.bookId._id.toString() === bookIdToRemove){
                    book.quantity -= 1;
                }
                return book
            })
            return books
        })

        if(cart){
            updateCart(userId!, cart, next)
            res.status(200).json({
                status: 'success',
                length: cart.length,
                data: cart
            })
        }
        else{
            res.status(404).json({
                status: 'not found'
            })
        }
    } catch (error) {
        next(error)
    }
}