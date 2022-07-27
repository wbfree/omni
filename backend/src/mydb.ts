require('dotenv').config({path: __dirname + '/.env'})

var connection = require('mysql').createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
  });      

exports.connect = (callback :any) => {
    connection.connect(callback)
    return connection;
}

exports.getMetadata = (callback :any) => {
    connection.query(`show tables from ${process.env.DB_DATABASE}`, callback );
}