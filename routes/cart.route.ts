import express from "express";
import { addBookToCart, clearCart, getAllCart, getCartByUserId, deleteOneTypeBook, removeOneBook } from "../controllers/cart.controller";

const Router = express.Router()

Router.route('/all').get(getAllCart)
Router.route('/:userId').get(getCartByUserId).post(addBookToCart).delete(deleteOneTypeBook)
Router.route('/:userId/clear-cart').put(clearCart)
Router.route('/:userId/remove').delete(removeOneBook)

export default Router