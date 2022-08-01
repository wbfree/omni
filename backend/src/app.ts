import express from 'express';
import { myDb } from './mydb';
import { myCommon } from 'cazzucazzu_'

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

myCommon.test_fnc();

app.set('json spaces', 4);
app.use(express.json());
app.use(myMiddleware)

app.get('/metadata', (req, res) => {
  myDb.Metadata().then((meta: myDb.DbDatabaseMetadata) => {
    res.json({ result: meta })
  })
});

app.get('/favicon.ico', (req, res) => {
  res.json({ request: 'No icon' });
});

app.get('/:obj', (req, res) => {
  myDb.Get(req.params.obj).then((results: myDb.QueryResult) => {
    res.json(results);
  })

});


//init
try {
  var con = myDb.connect(function (err: string) {
    if (err) throw new Error(err)

    console.log("DB Connected!");
    app.listen(port, () => {
      myDb.test()
      return console.log(`Express is listening at http://localhost:${port}`);
    });
  });
}
catch (ex) {
  console.log(ex);
}


