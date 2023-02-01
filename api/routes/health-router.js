import express, { response } from 'express';

const Router = express.Router();

const healthCheck = async (req, res) => {
    try {
        res.json({message: "Sever is healthy"});
        res.status(200);
    } catch(error) {
        response.status(503);
        response.json(error)
    }
}

Router.route('/').get(healthCheck);




export default Router;