import usersRouter from './users-router.js';
import healthRouter from './health-router.js';
import productRouter from './product-router.js';

// All requests should have /users after base URL
export const userData = (app) => {
    app.use('/v1/user', usersRouter);
}

export const healthCheck = (app) => {
    app.use('/healthz', healthRouter);
}

export const productData = (app) => {
    app.use('/v1/product', productRouter);
}