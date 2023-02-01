import usersRouter from './users-router.js';
import healthRouter from './health-router.js';

// All requests should have /users after base URL
export const userData = (app) => {
    app.use('/v1/user', usersRouter);
}

export const healthCheck = (app) => {
    app.use('/healthz', healthRouter)
}