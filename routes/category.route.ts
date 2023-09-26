import express from "express";
import { newCategory, getAllCategory, deleteCategory, updateCategory } from "../controllers/category.controller";

const Router = express.Router();

Router.route('/new-category').post(newCategory);
Router.route('/all-category').get(getAllCategory);
Router.route('/:categoryId').delete(deleteCategory).put(updateCategory);

export default Router