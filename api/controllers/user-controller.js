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
            var err = 'User ID doesnot exist';
            res.status(404);
            next(err);
            break;

        case 500:
            res.status(500);
            res.json(next);
            break;

    }
}

// Get method
export const getById  = async (req, res, next) => {
    
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
        const auth = await userService.authenticateUser(username, password);

        if(auth) { //If matches then send details else send forbidden error
            const id = req.params.userId;
            const validId = await userService.checkExistingUserById(id);

            if(validId) {
                const data = await userService.getById(id);
                setSuccess(res, data);
            } else {
                setError(400, res, next);
            }
            
        } else {
            setError(403, res, next);
        }

    }
    
}

export const post  = async (req, res, next) => {
        //If nothing passed in body
        if(!Object.keys(req.body).length) {
            // var err = new Error('No Content');
            setError(204, res,next);
        } else if(Object.keys(req.body).length != 4) { //If more or less data is passed
            setError(400, res,next);
        } else {
            const {first_name, last_name, password, username} = req.body; // Destruct data from req body
            
            // if any of the fields are empty or null or field name is wrong
            if(first_name == undefined || first_name == "" || last_name == undefined || last_name == "" || password == undefined || password == "" || username == undefined || username == "") {
                setError(400, res,next);
            } else {
                // Check if given username already exists
                const count = await userService.checkExistingUser(username);
                // If exists then throw error else save data
                if(count > 0) {
                    setError(400, res,next);
                } else {
                    // Username should be valid email address
                    const regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    if(regexp.test(username)) {
                        const data = await userService.saveUser(first_name, last_name, password, username);
                        if(data) {
                            res.status(201);
                            res.json({message: "User has been created successfully"})
                        } else {
                            setError(400, res, next);
                        }
                    } else {
                        setError(400, res, next);
                    }
                }

            }
        }
}

export const update = async (req, res, next) => {

    // Check if crendentials has been passed or not
    if(!req.get('Authorization')) {
        setError(401, res, next);
    } else {    
        const credentials = Buffer.from(
            req.get('Authorization').split(' ')[1], 'base64'
        )
        // username:password
        .toString()
        // [username, password]
        .split(':');

        const username = credentials[0]
        const password = credentials[1]

        // Authenticate user to be able to update data
        const auth = await userService.authenticateUser(username, password);

        if(auth) {

            const id = req.params.userId;
            const userExists = await userService.checkExistingUserById(id);
            
            if (userExists) {

                if(!Object.keys(req.body).length) { //IF no data provided to update
                    setError(204, res,next);
                } else if(Object.keys(req.body).length > 3) { //If more or less data is passed
                    setError(400, res,next);
                } else {
                    // If any other field is tried to update other than first_name, last_name, password
                    // then throw error
                    let flag = true;
                    for(let key in req.body) {
                        if(key === 'first_name' || key==='last_name' || key==='password') {
                            continue
                        } else {
                            flag = false;
                        }
                    }
                    
                    if(!flag) {
                        setError(400, res,next);
                    } else {
                        const {first_name} = req.body;
                        const {last_name} = req.body;
                        const {password} = req.body;
                        const data = await userService.update(id, first_name, last_name, password);
                        
                        if(data) {
                            setSuccess(res, {message: "Updated Successfully"})
                        }
                    }
                    
                }
                
            } else {
                setError(404, res, next)
            }
            
        } else {
            setError(403, res, next);
        }
    }
}