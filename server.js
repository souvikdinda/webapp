import app from './api/app.js';
import dotenv from 'dotenv';
import logger from './api/logger/index.js';
dotenv.config();

const PORT = process.env.PORT || 3000;

// To make the backend application listen to port 8080
// app.listen takes two input parameters, port and callback function
app.listen(PORT, () => {
    logger.info(`Server running on port: ${PORT}`);
});