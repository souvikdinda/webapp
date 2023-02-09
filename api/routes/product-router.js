import express from 'express';
import * as productController from '../controllers/product-controller.js';

const Router = express.Router();

// Get Routers
Router.route('/:productId').get(productController.getProduct);

// Post router
Router.route('/').post(productController.createProduct);

// Put router
Router.route('/:productId').put(productController.putProduct);

// Patch router
Router.route('/:productId').patch(productController.patchProduct);

// Delete router
Router.route('/:productId').delete(productController.deleteProduct);


export default Router;