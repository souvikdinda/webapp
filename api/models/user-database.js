// get the client
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

// create the connection to database
const pool = mysql.createPool({
  host: process.env.DB_HOSTNAME,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME
});

// Create connection pool
const poolPromise = pool.promise()

export default poolPromise;