import express from 'express';

require('dotenv').config({path: __dirname + '/.env'})

//mysql
var mysql = require('mysql');

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
});

con.connect(function(err) { 
  if (err) 
    console.log(err);
  else
    console.log("DB Connected!");
});

//express
const app = express();
const port = 4000;

function myMiddleware (req, res, next) {
  if (req.method === 'GET') { 
    console.log(`${req.method} ${req.url}`)
    console.log(process.env.DB_HOST)
  }
  next()
}

app.set('json spaces', 4);
app.use(express.json());
app.use(myMiddleware)

app.get('/dbcfg', (req, res) => {
    res.json({request: 'Database configuration'});
});

app.get('/:db', (req, res) => {
    res.json({request: req.params.db});
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});