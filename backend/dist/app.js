"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mydb_1 = require("./mydb");
//mysql
//var mydb = require('./mydb');
//express
const app = (0, express_1.default)();
const port = 4000;
function myMiddleware(req, res, next) {
    if (req.method === 'GET') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
}
app.set('json spaces', 4);
app.use(express_1.default.json());
app.use(myMiddleware);
app.get('/metadata', (req, res) => {
    (0, mydb_1.GetMetadata)().then((meta) => {
        res.json({ result: meta });
    });
});
app.get('/favicon.ico', (req, res) => {
    res.json({ request: 'No icon' });
});
app.get('/:obj', (req, res) => {
    (0, mydb_1.Get)(req.params.obj).then((results) => {
        res.json(results);
    });
});
//init
try {
    mydb_1.connection.connect((err) => {
        if (err)
            throw new Error(err);
        console.log("DB Connected!");
        app.listen(port, () => {
            return console.log(`Express is listening at http://localhost:${port}`);
        });
    });
}
catch (ex) {
    console.log(ex);
}
//# sourceMappingURL=app.js.map