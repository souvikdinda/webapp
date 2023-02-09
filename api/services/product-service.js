import e from 'cors';
import Product from '../models/product-model.js';
import User from '../models/user-model.js';
import { update } from './user-service.js';

export const saveProduct = async (username, data) => {
    try {
        const user = await User.findOne({where: {username}});
        const newProduct = await user.createProduct(data);
        return newProduct;
    } catch(error) {
        return false;
    }

}

export const getProduct = async (id) => {
    try {
        const product = await Product.findOne({where: {id}})
        return product;
    } catch(err) {
        return false
    }
}

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
        return false
    }
}

export const updateProduct = async (username, productId, data) => {
    try {
        const user = await User.findOne({where: {username}});
        const res = await user.getProducts({where: {id: productId}});
        const product = res[0];
        const updatedProduct = await product.update(data);
        return updatedProduct
    } catch(err) {
        return false
    }
}

export const deleteProduct = async (username, productId) => {
    try {
        const user = await User.findOne({where: {username}});
        const res = await user.getProducts({where: {id: productId}});
        const product = res[0];
        const deletedProduct = await product.destroy();
        return deletedProduct;
    } catch(err) {
        return false
    }
}