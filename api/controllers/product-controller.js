import * as productService from '../services/product-service.js';
import * as userService from '../services/user-service.js';

// Standard success message
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
            var err = 'Product doesnot exist';
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

// Product details can be fetched by anyone with valid product id
export const getProduct = async (req, res, next) => {
    
    if(!Number.isInteger(parseInt(req.params.productId))) {
        setError(400, res, next)
        return 0
    }
    const productData = await productService.getProduct(req.params.productId);
    if(productData) {
        setSuccess(res, productData)
    } else {
        setError(404, res, next);
    }   
    
}


// Product can be created only by authenticated user
export const createProduct = async (req, res, next) => {

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
        
        if(authenticate) { //If matches then send details else send forbidden error
            
            if(!Object.keys(req.body).length) {
                setError(204, res,next);
            } else if(Object.keys(req.body).length != 5) { //If more or less data is passed
                setError(400, res,next);
            } else {
                const {name, description, sku, manufacturer, quantity} = req.body;
                // Check if all fields are entered correctly
                if(name === undefined || description === undefined || sku === undefined || manufacturer === undefined || quantity === undefined || name === "" || description === "" || sku === "" || manufacturer === "" || quantity === "" || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
                    setError(400, res,next);
                } else {
                    const data = await productService.saveProduct(username, req.body);
                    
                    if(!data) {
                        setError(400, res, next);
                    } else {
                        res.status(201);
                        res.json(data)
                    }

                }
            }
            
        } else {
            setError(401, res, next);
        }

    }
}

// Product details can be updated only by authenticated user
export const putProduct = async (req, res, next) => {
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
        
        if(authenticate) { //If matches then send details else send forbidden error
            
            const authorize = await productService.authorizeToUpdate(username, req.params.productId);
            if(authorize) {
                if(!Object.keys(req.body).length) {
                    setError(204, res,next);
                } else if(Object.keys(req.body).length != 5) { //If more or less data is passed
                    setError(400, res,next);
                } else {
                    const {name, description, sku, manufacturer, quantity} = req.body;
                    // Put request should have all the required fields
                    if(name === undefined || description === undefined || sku === undefined || manufacturer === undefined || quantity === undefined || name === "" || description === "" || sku === "" || manufacturer === "" || quantity === "" || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
                        setError(400, res,next);
                    } else {
                        const data = await productService.updateProduct(username, req.params.productId, req.body);
                        if(!data) {
                            setError(400, res, next);
                        } else {
                            setSuccess(res, data);
                        }

                    }
                }
            } else {
                setError(403, res, next);
            }
            
        } else {
            setError(401, res, next);
        }

    }
}


// Patch can be used to update product details by authenticated user
export const patchProduct = async (req, res, next) => {
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
        
        if(authenticate) { //If matches then send details else send forbidden error
            
            const authorize = await productService.authorizeToUpdate(username, req.params.productId);
            if(authorize) {
                if(!Object.keys(req.body).length) {
                    setError(204, res,next);
                } else if(Object.keys(req.body).length > 5) { //If more or less data is passed
                    setError(400, res,next);
                } else {

                    let flag = true;
                    for(let key in req.body) {
                        if(key === 'name' || key==='description' || key==='sku' || key === 'manufacturer' || key === 'quantity') {
                            if(key === 'quantity') {
                                const quantity = req.body.quantity
                                if(!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
                                    setError(400, res, next)
                                    break
                                }
                            } else  continue
                        } else {
                            flag = false;
                        }
                    }

                    if (!flag) {
                        setError(400, res,next);
                    } else {
                        const data = await productService.updateProduct(username, req.params.productId, req.body);
                        if(!data) {
                            setError(400, res, next);
                        } else {
                            setSuccess(res, data);
                        } 
                    }
                }
            } else {
                setError(403, res, next);
            }
            
        } else {
            setError(401, res, next);
        }

    }
}

export const deleteProduct = async (req, res, next) => {
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
        
        if(authenticate) { //If matches then send details else send forbidden error
            
            const productExists = await productService.getProduct(req.params.productId);

            if(!productExists) {
                setError(404, res, next)
            } else {
                const authorize = await productService.authorizeToUpdate(username, req.params.productId);
                if(authorize) {
                    const deletedProduct = await productService.deleteProduct(username, req.params.productId);

                    if(!deletedProduct) {
                        setError(503, res, next)
                    } else {
                        setSuccess(res, deletedProduct)
                    }

                } else {
                    setError(403, res, next);
                }
            }
            
        } else {
            setError(401, res, next);
        }

    }
}