import { DataTypes } from "sequelize";
import sequelize from "./index.js";
import User from './user-model.js'

const Product = sequelize.define('Product', {
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

User.hasMany(Product, {
    foreignKey: {
        name: 'owner_user_id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


export default Product;