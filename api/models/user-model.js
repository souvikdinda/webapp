import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: 'account_created',
    updatedAt: 'account_updated',
    freezeTableName: true
});

export default User;