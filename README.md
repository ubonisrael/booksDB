# BOOKSDB

BooksDB is an e-book service built using Typescript, Express and Prisma.

## DESCRIPTION

BooksDB is a web application for reviewing and rating books.
The backend is built with Node.js and Express, and Prisma ORM is used for database operations with MySQL. The project aims to demonstrate building a server-side application with these technologies.

### BUILT WITH

+ Typescript
+ NodeJS + Express
+ Prisma with MySQL
+ Testing: Postman
+ Version Control: Git
+ Hosting: Render

### CHALLENGES

+ Error handling
+ Database Triggers
+ Database schema design

### FUTURE IMPROVEMENTS

+ Manually add trigger for updating a books rating when a review is submitted
+ Improve error handling

## GETTING STARTED

Follow these instructions in order to get a copy of the project up and running on your local machine for development and testing purposes.

### PREREQUISITES

- You must have MySQL (minimum version 5.7.x) installed and running on your machine.
- You must have NodeJS (minimum version 21.5.x) installed on your machine

Clone the repository
```
$ git clone https://github.com/ubonisrael/booksDB
$ cd booksDB
$ npm install # install project dependencies
```

### SETUP A DATABASE

Run the setupdb.sql script (modify it before running to fit your needs) to create a MySQL database for the project.  

Create a .env file and add the following:
```
PORT=<port_number>
JWT_SECRET=<jwt_secret_token>
JWT_EXPIRES_IN=<jwt_expiration_duration>
DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/DATABASE>
```
Replace `<port_number>`, `<your_jwt_secret>`, `<jwt_expiration_duration>`, `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE` with your actual configurations.  

Run the following command to ensure that Prisma is set up properly
```
$ npx prisma migrate dev --name init # runs prisma generate under the hood
```
- This generates PrismaClient from your Prisma schema file (schema.prisma), which defines your data model and other configurations.
- It creates a new SQL migration file for this migration
- It runs the SQL migration file against the database

### START APPLICATION (DEV SERVER)

Project setup is now complete, to start the application in the development server run the command.
```
$ npm run dev
```

**NOTE**  
A user with administrative privileges can only be created directly on the backend or by another user with administrative privileges using the "/api/v1/auth/register" endpoint.  
To create a user with administrative privileges:
- Run the create_admin.sql script on your MySQL database.
- Alternatively, you could change the "isAdmin" attribute of a user by using the UPDATE command or by editing on Prisma Studio

## AUTHOR
+ Twitter - [@jakpanudoh](https://www.twitter.com/jakpanudoh)
+ Github - [@ubonisrael](https://github.com/ubonisrael)
+ LinkedIn - [Ubonisrael Akpanudoh](https://www.linkedin.com/in/ubonisrael-akpanudoh-44ba82246/)
