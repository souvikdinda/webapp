import * as prod from './productionLogger.js';
import * as dev from './devLogger.js';
import dotenv from 'dotenv';
dotenv.config();

var logger = null;

if(process.env.ENVIRONMENT === 'production') {
    logger = prod.productionLogger();
} else {
    logger = dev.devLogger();
}

export default logger;