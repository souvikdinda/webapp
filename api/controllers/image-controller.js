import multer from 'multer';
import * as imageService from '../services/image-service.js'
import * as userService from '../services/user-service.js';
import * as productService from '../services/product-service.js';
import logger from '../logger/index.js';
import SDC from 'statsd-client';
import dotenv from 'dotenv';
dotenv.config();
const sdc = new SDC({host: process.env.METRICS_HOSTNAME, port: process.env.METRICS_PORT});

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if(file.mimetype.split('/')[0] === "image") {
        cb(null, true)
    } else {
        return cb(null, false)
    }
}
const upload = multer({ storage ,fileFilter});

const setSuccess = (res, obj) => {
    res.status(200);
    res.json(obj);
}

// Handling all kinds of error codes
const setError = (errorCode, res, next) => {
    switch(errorCode) {
        case 401:
            var err = 'Not Authenticated';
            res.status(401).set('WWW-Authenticate','Basic');// Request to send Authentication tag with Basic token
            next(err);
            break;
        
        case 204:
            res.status(204);
            res.json();
            break;
        
        case 400:
            var err = 'Bad Request';
            res.status(400);
            next(err);
            break;

        case 403:
            var err = 'Authentication Failed';
            res.status(403);
            next(err);
            break;
        
        case 404:
            var err = 'Image doesnot exist';
            res.status(404);
            next(err);
            break;

        case 500:
            res.status(500);
            res.json(next);
            break;

        case 503:
            var err = "Request couldn't be completed temporarily"
            res.status(503);
            res.json(next);
            break;

    }
}

export const getAllImages = async (req, res, next) => {
    sdc.increment('endpoint.getAllImages');
    logger.info(`/GET/ImageController/Initiated`)
    if(!Number.isInteger(parseInt(req.params.productId))) {
        setError(400, res, next)
        return 0
    }

    if(!req.get('Authorization')) { //If request header doesnt contain Authorization tag
        setError(401, res, next); // Request for sending request again with authorization tag
    } else {
        // Fetch credentials from basic token, decoding using base64
        const credentials = Buffer.from(
            req.get('Authorization').split(' ')[1], 'base64'
        )
        // username:password
        .toString()
        // [username, password]
        .split(':');

        const username = credentials[0]
        const password = credentials[1]

        // Check if credentials match
        const authenticate = await userService.authenticateUser(username, password);

        if(Object.keys(authenticate)[0] == 'error') {
            setError(500, res, authenticate);
        } else {
            if(authenticate) { //If matches then send details else send forbidden error
                const productId = req.params.productId;
                const authorize = await productService.authorizeToUpdate(username, req.params.productId);
                if(authorize) {
                    const images = await imageService.getAllImages(productId)
                    if (Object.keys(images).length == 0) {
                        setError(404, res,next)
                        return
                    }
                    logger.info(`/GET/ImageController/Success`)
                    setSuccess(res,images)
                } else {
                    setError(403, res, next);
                }
                
            } else {
                setError(401, res, next);
            }
        }

    }
    
}

export const saveImage = async (req, res, next) => {
    sdc.increment('endpoint.uploadImage');
    logger.info(`/POST/ImageController/Initiated`)
    if(!Number.isInteger(parseInt(req.params.productId))) {
        setError(400, res, next)
        return 0
    }

    if(!req.get('Authorization')) { //If request header doesnt contain Authorization tag
        setError(401, res, next); // Request for sending request again with authorization tag
    } else {
        // Fetch credentials from basic token, decoding using base64
        const credentials = Buffer.from(
            req.get('Authorization').split(' ')[1], 'base64'
        )
        // username:password
        .toString()
        // [username, password]
        .split(':');

        const username = credentials[0]
        const password = credentials[1]

        // Check if credentials match
        const authenticate = await userService.authenticateUser(username, password);

        if(Object.keys(authenticate)[0] == 'error') {
            setError(500, res, authenticate);
        } else {
            if(authenticate) { //If matches then send details else send forbidden error
                const productId = req.params.productId;
                const authorize = await productService.authorizeToUpdate(username, req.params.productId);
                if(authorize) {
                    
                    const middleware = upload.single('image');

                    return middleware(req, res, async ()=> {
                        try {
                            const file = req.file;
                            const productId = req.params.productId
                            if(!file) {
                                var err = 'File not an image'
                                res.status(400)
                                return next(err)
                            }

                            const result = await imageService.uploadImageS3(file, productId);
                            if(!result) {
                                logger.warn(`/POST/ImageController/Failed`)
                                setError(500, res, 'Seems like something went wrong')
                                return
                            }
                            logger.info(`/POST/ImageController/Success`)
                            res.status(201)
                            res.json(result)
                        }
                        catch(err) {
                            res.status(400)
                            next(err)
                        }
                    })

                } else {
                    setError(403, res, next);
                }
                
            } else {
                setError(401, res, next);
            }
        }

    }
}

export const getImage = async (req, res, next) => {
    sdc.increment('endpoint.getImage');
    logger.info(`/GET/ImageController/Initiated/ImageID ${req.params.imageId}`);
    if((!Number.isInteger(parseInt(req.params.productId))) || (!Number.isInteger(parseInt(req.params.imageId)))) {
        setError(400, res, next)
        return 0
    }
    
    if(!req.get('Authorization')) { //If request header doesnt contain Authorization tag
        setError(401, res, next); // Request for sending request again with authorization tag
    } else {
        // Fetch credentials from basic token, decoding using base64
        const credentials = Buffer.from(
            req.get('Authorization').split(' ')[1], 'base64'
        )
        // username:password
        .toString()
        // [username, password]
        .split(':');

        const username = credentials[0]
        const password = credentials[1]

        // Check if credentials match
        const authenticate = await userService.authenticateUser(username, password);

        if(Object.keys(authenticate)[0] == 'error') {
            setError(500, res, authenticate);
        } else {
            if(authenticate) { //If matches then send details else send forbidden error
                const productId = req.params.productId;
                const authorize = await productService.authorizeToUpdate(username, req.params.productId);
                if(authorize) {
                    const imageId = req.params.imageId;
                    const images = await imageService.getImage(imageId, productId);
                    if(images) {
                        logger.info(`/GET/ImageController/Success/ImageId ${req.params.imageId}`);
                        setSuccess(res, images);
                    } else {
                        setError(404, res,next)
                    }
                    
                } else {
                    setError(403, res, next);
                }
                
            } else {
                setError(401, res, next);
            }
        }

    }

}

export const deleteImage = async (req, res, next) => {
    sdc.increment('endpoint.deleteImage');
    logger.info(`/DELETE/ImageController/Initiated/ImageId ${req.params.imageId}`);
    if((!Number.isInteger(parseInt(req.params.productId))) || (!Number.isInteger(parseInt(req.params.imageId)))) {
        setError(400, res, next)
        return 0
    }
    
    if(!req.get('Authorization')) { //If request header doesnt contain Authorization tag
        setError(401, res, next); // Request for sending request again with authorization tag
    } else {
        // Fetch credentials from basic token, decoding using base64
        const credentials = Buffer.from(
            req.get('Authorization').split(' ')[1], 'base64'
        )
        // username:password
        .toString()
        // [username, password]
        .split(':');

        const username = credentials[0]
        const password = credentials[1]

        // Check if credentials match
        const authenticate = await userService.authenticateUser(username, password);

        if(Object.keys(authenticate)[0] == 'error') {
            setError(500, res, authenticate);
        } else {
            if(authenticate) { //If matches then send details else send forbidden error
                const productId = req.params.productId;
                const authorize = await productService.authorizeToUpdate(username, req.params.productId);
                if(authorize) {
                    const imageId = req.params.imageId;
                    const images = await imageService.getImage(imageId, productId);
                    if(images) {
                        const deletedImage = await imageService.deleteImage(imageId);
                        if (deletedImage) {
                            logger.info(`/DELETE/ImageController/Success/ImageId ${req.params.imageId}`);
                            setError(204, res,next);
                        } else {
                            setError(500, res,next)
                        }
                    } else {
                        setError(404, res,next)
                    }
                    
                } else {
                    setError(403, res, next);
                }
                
            } else {
                setError(401, res, next);
            }
        }

    }
}