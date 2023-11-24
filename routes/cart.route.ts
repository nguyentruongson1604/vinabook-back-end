import express from "express";
import { addBookToCart, clearCart, getAllCart, getCart, getCartByUserId, deleteOneTypeBook, removeOneBook, initCartFromLocal } from "../controllers/cart.controller";
import checkRole from "../middlewares/checkRole";
import { verifyToken } from "../middlewares/verifyToken";

const Router = express.Router()

Router.route('/all').get(verifyToken,checkRole('admin'),getAllCart)
Router.route('/get-cart').get(verifyToken, checkRole("all"), getCart)
Router.route('/init-cart').post(verifyToken, checkRole("all"), initCartFromLocal)
Router.route('/add-book').post(verifyToken, checkRole("all"), addBookToCart)
Router.route('/clear-cart').put(verifyToken, checkRole("all"), clearCart)
Router.route('/delete-book').delete(verifyToken, checkRole("all"), deleteOneTypeBook)
Router.route('/remove-book').delete(verifyToken, removeOneBook)
Router.route('/get-cart/:userId').get(verifyToken, checkRole("admin"), getCartByUserId)

export default Router