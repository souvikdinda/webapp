import express, { response } from 'express';
import logger from '../logger/index.js';
import SDC from 'statsd-client'
import dotenv from 'dotenv';
dotenv.config();

const sdc = new SDC({host: process.env.METRICS_HOSTNAME, port: process.env.METRICS_PORT});
var start = new Date();

const Router = express.Router();

const healthCheck = async (req, res) => {
    try {
        sdc.timing('health.timeout', start);
        logger.info("/health running fine");
        sdc.increment('endpoint.health');
        res.json({message: "Sever is healthy"});
        res.status(200);
    } catch(error) {
        response.status(503);
        response.json(error)
    }
}

Router.route('/').get(healthCheck);




export default Router;