import express from 'express'
import { deleteAuthor, getAllAuthor, getAuthorById, newAuthor, updateAuthor } from '../controllers/author.controller';

const Router = express.Router();

Router.route('/new-author').post(newAuthor);
Router.route('/all-author').get(getAllAuthor);
Router.route('/:authorId').put(updateAuthor).delete(deleteAuthor).get(getAuthorById);

export default Router