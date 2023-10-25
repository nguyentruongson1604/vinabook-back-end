import express from "express";
import { addBookToCart, clearCart, getAllCart, getCartByUserId, deleteOneTypeBook, removeOneBook } from "../controllers/cart.controller";
import checkRole from "../middlewares/checkRole";
import { verifyToken } from "../middlewares/verifyToken";

const Router = express.Router()

Router.route('/all').get(verifyToken,checkRole('admin'),getAllCart)
Router.route('/:userId').get(verifyToken, checkRole("all"), getCartByUserId)
.post(verifyToken, checkRole("all"), addBookToCart)
.delete(verifyToken, checkRole("all"), deleteOneTypeBook)
Router.route('/:userId/clear-cart').put(verifyToken, checkRole("all"), clearCart)
Router.route('/:userId/remove').delete(verifyToken, removeOneBook)

export default Router