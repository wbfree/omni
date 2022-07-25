"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: __dirname + '/.env' });
const app = (0, express_1.default)();
const port = 4000;
function myMiddleware(req, res, next) {
    if (req.method === 'GET') {
        console.log(`${req.method} ${req.url}`);
        //console.log(process.env.NODE_ENV)
    }
    next();
}
app.set('json spaces', 4);
app.use(express_1.default.json());
app.use(myMiddleware);
app.get('/dbcfg', (req, res) => {
    res.json({ request: 'Database configuration' });
});
app.get('/:db', (req, res) => {
    res.json({ request: req.params.db });
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map