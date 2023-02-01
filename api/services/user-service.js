import poolPromise from '../models/user-database.js';
import bcrypt from 'bcrypt';

// Check if credentials match
export const authenticateUser = async (username, password) => {
    const [rows,fields] = await poolPromise.query("SELECT password FROM user WHERE `username` = ?", username);
    if(rows.length > 0) {
        const hashPassword = rows[0].password;
        return bcrypt.compareSync(password, hashPassword);
    } else {
        return false
    }
}

// Get data for given id if nothing found then user doesnt exist
export const getById = async (id) => {
    const [rows,fields] = await poolPromise.query("SELECT first_name, last_name, username FROM USER WHERE `id` = ?", id);
    const data = rows[0];
    if(data == undefined) {
        return {message: "User doesnt exist, confirm UserID!"}
    } else return data;
}

// Check if user exists for given username
export const checkExistingUser = async (username) => {
    const [rows,fields] = await poolPromise.query("SELECT count(*) as count FROM user WHERE `username` = ?", username);
    const {count} = rows[0];
    return count;
}

// Insert data for user creation
export const saveUser = async (first_name, last_name, password, username) => {
    // Hashing password
    try {
        // Bcrypt is used for hashing the password
        // Auto-generated salt
        // SaltRounds used 10
        const hash = bcrypt.hashSync(password, 10);
        const [rows,fields] = await poolPromise.query("INSERT INTO user (first_name, last_name, password, username) VALUES (?, ?, ?, ?);", [first_name, last_name, hash, username]);
        const data = rows;
        if(data) {
            return true
        }
    } catch(error) {
        console.log(error);
        return false
    }
}

// Check if user exists by id
export const checkExistingUserById =  async (id) => {
    const [rows,fields] = await poolPromise.query("SELECT count(*) as count FROM user WHERE `id` = ?", id);
    const {count} = rows[0];
    return count > 0;
}

// Update data for user
export const update =  async (id, first_name, last_name, password) => {
    if(first_name != undefined) {
        await poolPromise.query("UPDATE user SET `first_name` = ? WHERE `id` = ?;", [first_name, id]);
    }

    if(last_name != undefined) {
        await poolPromise.query("UPDATE user SET `last_name` = ? WHERE `id` = ?;", [last_name, id]);
    }

    if(password != undefined) {
        const hash = bcrypt.hashSync(password, 10);
        await poolPromise.query("UPDATE user SET `password` = ? WHERE `id` = ?;", [hash, id]);
    }

    return true;
}