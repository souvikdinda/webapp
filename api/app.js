import express from 'express';
import cors from 'cors';
import * as routes from './routes/index.js';
import sequelize from './models/index.js';
import User from './models/user-model.js';
import Product from './models/product-model.js';
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

routes.userData(app);
routes.healthCheck(app);

sequelize.sync({alter: true}).then((data) => {
    console.log("Tables updated on database")
}).catch((err) => {
    console.log(err)
})

export default app;