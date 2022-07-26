import express from 'express';

require('dotenv').config({path: __dirname + '/.env'})

//mysql
var mysql = require('mysql');

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
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

  con.query("SELECT * FROM test."+req.params.db, function (err, result, fields) {
    if (err) throw err;

    res.json({err: err, result: result, fields: fields });
    console.log(result);
  
  });

});


//init
try {
    con.connect(function(err) { 
    if (err) throw new Error(err)
    
    console.log("DB Connected!");
    app.listen(port, () => {
      return console.log(`Express is listening at http://localhost:${port}`);
    });  
  }); 
}
catch(ex) {
  console.log(ex);
}


