import Sequelize from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

// Create connection with database
const sequelize = new Sequelize(process.env.DB_DBNAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOSTNAME,
  dialect: 'mysql',
  port: process.env.DB_PORT,
  logging: false // Not to console SQL queries that are run by sequelize
});

export default sequelize;