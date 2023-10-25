import express from "express";
import { newCategory, getAllCategory, deleteCategory, updateCategory, getCategoryById, getAllCategoryAndRelation } from "../controllers/category.controller";
import { verifyToken } from "../middlewares/verifyToken";
import checkRole from "../middlewares/checkRole";

const Router = express.Router();

Router.route('/new-category').post(verifyToken, checkRole("admin"), newCategory);
Router.route('/all-category').get(getAllCategory);
Router.route('/relation').get(getAllCategoryAndRelation);
Router.route('/:categoryId').delete(verifyToken, checkRole("admin"), deleteCategory)
.put(verifyToken, checkRole("admin"), updateCategory).get(getCategoryById);

export default Router