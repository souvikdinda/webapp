import app from './api/app.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;

// To make the backend application listen to port 8080
// app.listen takes two input parameters, port and callback function
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});