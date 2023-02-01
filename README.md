# RESTful service for User Details

> Technologies Used: NodeJS, ExpressJS
> Database: MySQL
> Libraries Used: Bcrypt, dotenv, mysql2, jest

### Prerequisite to run the application:
*NodeJS*: v16.16.0
*MySQL*: v8.0.31

### Steps to run application locally:
1. Clone from the repository to local machine
    Command: git clone 'repo-URL'

2. Run below command to install dependencies
    Command: npm install

3. Run below command to start server
    Command: npm run start

### Valid Endpoints:
**GET** http://localhost:8080/v1/user/{userId} 
    *Note: Username, Password is required for authentication*

**POST** http://localhost:8080/v1/user 
    *first_name, last_name, password, username is expected in payload*

**PUT** http://localhost:8080/v1/user/{userId}
    *first_name, last_name, password can be updated*




This project is part of coursework for **CSYE 6225**

_Author: Souvik Dinda_