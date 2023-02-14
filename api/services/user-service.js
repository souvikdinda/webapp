import bcrypt from 'bcrypt';
import User from '../models/user-model.js'

// Check if credentials match
export const authenticateUser = async (username, password) => {
    const auth = await User.findOne({where: {username}});
    if(auth !== null) {
        const hashPassword = auth.password;
        return bcrypt.compareSync(password, hashPassword);
    } else {
        return false
    }
}

// Check if user exists for given username
export const authorizeAndGetUser = async (id, username) => {
    const response = await User.findOne({where: {username}});
    if(response.id === (+id)) {
        const data = {id: response.id, first_name: response.first_name, last_name: response.last_name, username: response.username, account_created: response.account_created, account_updated: response.account_updated}
        return data;
    } else {
        return false;
    }
}

// Insert data for user creation
export const saveUser = async (userData) => {
    // Hashing password
    try {
        // Bcrypt is used for hashing the password
        // Auto-generated salt
        // SaltRounds used 10
        const {first_name, last_name, password, username} = userData;

        const userEsists = await User.findOne({where: {username}});
        if(userEsists) {
            return false
        } else {
            const hash = bcrypt.hashSync(password, 10);
            const response = await User.create({first_name, last_name, password: hash, username});
            const data = {id: response.id, first_name: response.first_name, last_name: response.last_name, username: response.username, account_created: response.account_created, account_updated: response.account_updated}
            return data
        }
    } catch(error) {
        return false
    }
}

// Update data for user
export const update =  async (id, data) => {
    try {
        if(data.password !== undefined || data.password !== "") {
            const {password} = data;
            const hash = bcrypt.hashSync(password, 10);
            data.password = hash;
        }
        const user = await User.findOne({where: {id}});
        const response = await user.update(data);
        const updatedUser = {id: response.id, first_name: response.first_name, last_name: response.last_name, username: response.username, account_created: response.account_created, account_updated: response.account_updated};
        return updatedUser;
    } catch(err) {
        console.log(err);
        return false;
    }

}