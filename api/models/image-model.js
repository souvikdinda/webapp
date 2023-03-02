import { DataTypes } from "sequelize";
import sequelize from "./index.js";
import Product from "./product-model.js"

const Image = sequelize.define('image', {
    image_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    file_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    s3_bucket_path: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: 'date_created',
    updatedAt: false,
    freezeTableName: true
});

Product.hasMany(Image, { // User can add multiple products and owner_user_id is foreign key in product table
    foreignKey: {
        name: 'product_id'
    },
    onDelete: 'CASCADE', // Deleting or updating user should reflect in product table
    onUpdate: 'CASCADE'
});

export default Image;