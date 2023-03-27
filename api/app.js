import express from 'express';
import cors from 'cors';
import * as routes from './routes/index.js';
import sequelize from './models/index.js';
import User from './models/user-model.js';
import Product from './models/product-model.js';
import Image from './models/image-model.js';
import logger from './logger/index.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

routes.userData(app);
routes.healthCheck(app);
routes.productData(app);

sequelize.sync({alter: false, force: false}).then((data) => {
    logger.info("Database connection established")
}).catch((err) => {
    logger.error(err)
})

export default app;