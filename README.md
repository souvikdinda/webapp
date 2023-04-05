# RESTful service for User Details

> Technologies Used: NodeJS, ExpressJS
> Database: MySQL
> Libraries Used: Bcrypt, dotenv, mysql2, chai, mocha, sequelize

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

**_User Data_**
**GET** http://localhost:8080/v1/user/{userId} 
    *Note: Username, Password is required for authentication*

**POST** http://localhost:8080/v1/user 
    *first_name, last_name, password, username is expected in payload*

**PUT** http://localhost:8080/v1/user/{userId}
    *first_name, last_name, password can be updated*


**_Product Data_**
**GET** http://localhost:8080/v1/product/{productId} 
    *Note: No authentication is r equired*

**POST** http://localhost:8080/v1/product 
    *name, description, sku(unique), manufacturer, quantity (more than 0 and should be number) is expected in payload*
    *Note: Username, Password is required for authentication*

**PUT** http://localhost:8080/v1/product/{productId}
    *name, description, sku(unique), manufacturer, quantity (more than 0 and should be number) is expected in payload to update existing details*
    *Note: Username, Password is required for authentication*

**PATCH** http://localhost:8080/v1/product/{productId}
    *name, description, sku(unique), manufacturer, quantity (more than 0 and should be number) can be updated. Updating all fields is not mandatory*
    *Note: Username, Password is required for authentication*

**DELETE** http://localhost:8080/v1/product/{productId}
    *To delete existing Product*
    *Note: Username, Password is required for authentication*

This project is part of coursework for **CSYE 6225**

_Author: Souvik Dinda_
