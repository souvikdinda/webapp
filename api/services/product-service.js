import e from 'cors';
import Product from '../models/product-model.js';
import User from '../models/user-model.js';
import logger from '../logger/index.js';

// Save product in DB for given user
export const saveProduct = async (username, data) => {
    try {
        const user = await User.findOne({where: {username}});
        const productExist = await Product.findOne({where: {sku: data.sku}});
        if(productExist) {
            return false
        } else {
            const newProduct = await user.createProduct(data);
            return newProduct;
        }
    } catch(error) {
        logger.warn(`ProductService ${error}`)
        return false;
    }

}

// Get product
export const getProduct = async (id) => {
    try {
        const product = await Product.findOne({where: {id}})
        return product;
    } catch(err) {
        logger.warn(`ProductService ${err}`)
        return false
    }
}

// Check if product exists for requesting user and check if user is authorized update/delete
export const authorizeToUpdate = async (username, productId) => {
    try {
        const user = await User.findOne({where: {username}});
        const productData = await user.getProducts({where: {id: productId}});
        if(productData[0] !== undefined) {
            return true;
        } else {
            return false;
        }
    } catch(err) {
        logger.warn(`ProductService ${err}`)
        return false
    }
}

// Update details for given product id
export const updateProduct = async (username, productId, data) => {
    try {
        const user = await User.findOne({where: {username}});
        const res = await user.getProducts({where: {id: productId}});
        const product = res[0];
        const updatedProduct = await product.update(data);
        return updatedProduct
    } catch(err) {
        logger.warn(`ProductService ${err}`)
        return false
    }
}


// Delete product
export const deleteProduct = async (username, productId) => {
    try {
        const user = await User.findOne({where: {username}});
        const res = await user.getProducts({where: {id: productId}});
        const product = res[0];
        const deletedProduct = await product.destroy();
        return deletedProduct;
    } catch(err) {
        logger.warn(`ProductService ${err}`)
        return false
    }
}