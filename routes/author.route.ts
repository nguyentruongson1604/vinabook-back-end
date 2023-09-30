import express from 'express'
import { deleteAuthor, getAllAuthor, getAuthorById, newAuthor, updateAuthor } from '../controllers/author.controller';
import { verifyToken } from '../middlewares/verifyToken';
import checkRole from '../middlewares/checkRole';

const Router = express.Router();

Router.route('/new-author').post(verifyToken, checkRole("admin"), newAuthor);
Router.route('/all-author').get(getAllAuthor);
Router.route('/:authorId').put(verifyToken, checkRole("admin"), updateAuthor)
.delete(verifyToken, checkRole("admin"), deleteAuthor)
.get(getAuthorById);

export default Router