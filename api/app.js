import express from 'express';
import cors from 'cors';
import * as routes from './routes/index.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

routes.userData(app);
routes.healthCheck(app);

export default app;