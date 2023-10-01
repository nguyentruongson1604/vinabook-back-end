import express from 'express'
import { allPublisher, deletePublisher, newPublisher, updatePublisher } from '../controllers/publisher.controller';
import { updateCategory } from '../controllers/category.controller';

const Router = express.Router();

Router.route('/all-publisher').get(allPublisher);
Router.route('/new-publisher').post(newPublisher);
Router.route('/:publisherId').delete(deletePublisher).put(updatePublisher);

export default Router