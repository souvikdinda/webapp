import { DataTypes } from "sequelize";
import sequelize from "./index.js";
import User from './user-model.js'

const Product = sequelize.define('product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sku: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    manufacturer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    timestamps: true,
    createdAt: 'date_added',
    updatedAt: 'date_last_updated',
    freezeTableName: true
});

User.hasMany(Product, { // User can add multiple products and owner_user_id is foreign key in product table
    foreignKey: {
        name: 'owner_user_id'
    },
    onDelete: 'CASCADE', // Deleting or updating user should reflect in product table
    onUpdate: 'CASCADE'
})


export default Product;