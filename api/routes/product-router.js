import express from 'express';
import * as productController from '../controllers/product-controller.js';
import * as imageController from '../controllers/image-controller.js';

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

// Get All Images
Router.route('/:productId/image').get(imageController.getAllImages);

// Save Image
Router.route('/:productId/image').post(imageController.saveImage);

// Get one image
Router.route('/:productId/image/:imageId').get(imageController.getImage);

// Delete image
Router.route('/:productId/image/:imageId').delete(imageController.deleteImage);


export default Router;