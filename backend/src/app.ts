import express from 'express';
import { GetMetadata, Get } from './mydb';
import { DatabaseMySql } from './mydb.mysql';
import { DbDatabaseMetadata, QueryResult } from 'omni_common'

//mysql
//var mydb = require('./mydb');

//express
const app = express();
const port = 4000;

function myMiddleware(req, res, next) {
  if (req.method === 'GET') {
    console.log(`${req.method} ${req.url}`)
  }
  next()
}

app.set('json spaces', 4);
app.use(express.json());
app.use(myMiddleware)

const dbConnection: DatabaseMySql = new DatabaseMySql

app.get('/metadata', (req, res) => {
  GetMetadata(dbConnection).then((meta: DbDatabaseMetadata) => {
    res.json({ result: meta })
  })
});

app.get('/favicon.ico', (req, res) => {
  res.json({ request: 'No icon' });
});

app.get('/:obj', (req, res) => {
  Get(dbConnection, req.params.obj).then((results: QueryResult) => {
    res.json(results);
  })

});

try {
  dbConnection.Connect((err: string) => {
    if (err) throw new Error(err)

    console.log("DB Connected!");
    app.listen(port, () => {
      return console.log(`Express is listening at http://localhost:${port}`);
    });
  });
}
catch (ex) {
  console.log(ex);
}


