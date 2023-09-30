import express from "express";
import { newCategory, getAllCategory, deleteCategory, updateCategory } from "../controllers/category.controller";
import { verifyToken } from "../middlewares/verifyToken";
import checkRole from "../middlewares/checkRole";

const Router = express.Router();

Router.route('/new-category').post(verifyToken, checkRole("admin"), newCategory);
Router.route('/all-category').get(getAllCategory);
Router.route('/:categoryId').delete(verifyToken, checkRole("admin"), deleteCategory)
.put(verifyToken, checkRole("admin"), updateCategory);

export default Router