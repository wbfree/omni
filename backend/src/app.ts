import express from 'express';
import dotenv from 'dotenv';

dotenv.config({path: __dirname + '/.env'})

const app = express();
const port = 4000;

function myMiddleware (req, res, next) {
  if (req.method === 'GET') { 
    console.log(`${req.method} ${req.url}`)
    //console.log(process.env.NODE_ENV)
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