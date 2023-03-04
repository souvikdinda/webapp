import S3 from "aws-sdk/clients/s3.js"
import dotenv from "dotenv"
import {v4 as uuid} from "uuid"
import Product from '../models/product-model.js'
import Image from '../models/image-model.js'
dotenv.config()

const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new S3({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
})

export const getAllImages = async(productId) => {
    try {
        const result = await Image.findAll({where: {product_id: productId}})
        return result
    } catch(err) {
        return false
    }
}

export const getImage = async(imageId, productId) => {
    try {
        const result = await Image.findOne({where: {image_id: imageId, product_id: productId}})
        return result
    } catch(err) {
        return false
    }
}

export const uploadImageS3 = async(file, productId) => {
    try {
        const param = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `images/${uuid()}`,
            Body: file.buffer
        };
        const result = await s3.upload(param).promise();
        if(result) {
            const product = await Product.findOne({where: {id: productId}});
            const filename = result.Key.split('/')[1]
            const newImage = await product.createImage({file_name: filename, s3_bucket_path: result.Key })
            return newImage
        }
    } catch(error) {
        return false
    }
}

export const deleteImage = async (imageId) => {
    try {
        const image = await Image.findOne({where: {image_id: imageId}});
        const param = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: image.s3_bucket_path
        };
        const result = await s3.deleteObject(param).promise();
        console.log(result)
        if(result) {
            const deletedImage = await image.destroy();
            return deletedImage
        } else {
            return false
        }
    } catch(error) {
        return false
    }
}