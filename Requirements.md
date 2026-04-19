##### First Install Softwares



postgresql-18.3-1-windows-x64

node-v25.8.0-x64





##### Open the PostgreSQL and create a database



CREATE DATABASE library\_db;

INSERT INTO admin(name,email,password)

VALUES('Admin','.,'');

CREATE TABLE admin (

&#x20;   id SERIAL PRIMARY KEY,

&#x20;   name VARCHAR(50) NOT NULL,

&#x20;   email VARCHAR(50) UNIQUE NOT NULL,

&#x20;   password VARCHAR(100) NOT NULL

);



CREATE TABLE librarian (

&#x20;   id SERIAL PRIMARY KEY,

&#x20;   name VARCHAR(50) NOT NULL,

&#x20;   email VARCHAR(50) UNIQUE NOT NULL,

&#x20;   password VARCHAR(100) NOT NULL

);



CREATE TABLE users (

&#x20;   id SERIAL PRIMARY KEY,

&#x20;   name VARCHAR(100) NOT NULL,

&#x20;   email VARCHAR(100) UNIQUE NOT NULL,

&#x20;   password VARCHAR(100) NOT NULL

);



CREATE TABLE books (

&#x20;   id SERIAL PRIMARY KEY,

&#x20;   title VARCHAR(100) NOT NULL,

&#x20;   author VARCHAR(100) NOT NULL,

&#x20;   category VARCHAR(100),

&#x20;   year INT,

&#x20;   quantity INT DEFAULT 0,

&#x20;   available INT DEFAULT 0

);



CREATE TABLE borrow (

&#x20;   id SERIAL PRIMARY KEY,

&#x20;   user\_id INT REFERENCES users(id),

&#x20;   book\_id INT REFERENCES books(id),

&#x20;   amount NUMERIC(10,2),

&#x20;   issue\_date DATE NOT NULL,

&#x20;   due\_date DATE NOT NULL,

&#x20;   return\_date DATE,

&#x20;   fine NUMERIC(10,2) DEFAULT 0,

&#x20;   status VARCHAR(20) DEFAULT 'Issued'

);



CREATE TABLE queries (

&#x20;   id SERIAL PRIMARY KEY,

&#x20;   user\_id INT REFERENCES users(id),

&#x20;   subject VARCHAR(200),

&#x20;   message TEXT,

&#x20;   status VARCHAR(20) DEFAULT 'Pending',

&#x20;   reply TEXT,

&#x20;   created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,

&#x20;   replied\_at TIMESTAMP

);







##### Inside the backend folder

##### create a Virtual Environment



python -m venv venv

venv\\Scripts\\Activate



pip install flask flask\_sqlalchemy flask\_cors psycopg2-binary flask-mail



python app.py



##### Inside of the of frontend folder



npm install axios react-router-dom chart.js react-chartjs-2



npm start





















