import express from 'express'
import { allPublisher, deletePublisher, getPublisherByCategory, getPublisherById, newPublisher, updatePublisher } from '../controllers/publisher.controller';
import checkRole from '../middlewares/checkRole';
import { verifyToken } from '../middlewares/verifyToken';

const Router = express.Router();

Router.route('/all-publisher').get(allPublisher);
Router.route('/new-publisher').post(verifyToken, checkRole("admin"), newPublisher);
Router.route('/:publisherId').delete(verifyToken, checkRole("admin"), deletePublisher).put(verifyToken, checkRole("admin"), updatePublisher).get(getPublisherById);
Router.route('/category/:categoryId').get(getPublisherByCategory)

export default Router