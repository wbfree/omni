import express from 'express';

//mysql
var mydb = require('./mydb'); 

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

app.get('/tables', (req, res) => {
  mydb.getMetadata( (err: any, result: any, fields: any) => res.json({err: err, result: result }));
});

app.get('/fields/:name', (req, res) => {
  var sql = 
  `show fields from ${process.env.DB_DATABASE}.${req.params.name}`;
  
  con.query(sql, function (err: any, result: any, fields: any) {
    res.json({err: err, result: result });  
  });
});

app.get('/keys', (req, res) => {
  var sql = 
  `SELECT us.TABLE_SCHEMA, us.TABLE_NAME, us.COLUMN_NAME,
	us.REFERENCED_TABLE_SCHEMA, us.REFERENCED_TABLE_NAME, us.REFERENCED_COLUMN_NAME
  FROM information_schema.KEY_COLUMN_USAGE us
  WHERE TABLE_SCHEMA='${process.env.DB_DATABASE}'`;
  
  con.query(sql, function (err: any, result: any, fields: any) {
    res.json({err: err, result: result });  
  });
});



app.get('/favicon.ico', (req, res) => {
  res.json({request: 'No icon'});
});

app.get('/:db', (req, res) => {
  con.query("SELECT * FROM "+req.params.db, function (err: any, result: any, fields: any) {
    res.json({err: err, result: result, fields: fields });  
  });
});


//init
try {
  var con = mydb.connect(function(err) { 
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


