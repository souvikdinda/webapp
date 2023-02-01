import express from 'express';
import * as usersController from '../controllers/user-controller.js';

const Router = express.Router();

// Get Routers
Router.route('/:userId').get(usersController.getById);

// Post router
Router.route('/').post(usersController.post);

// // Put router
Router.route('/:userId').put(usersController.update);

// // Delete router
// Router.route('/:id').delete(usersController.delete);



export default Router;