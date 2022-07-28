var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require('dotenv').config({ path: __dirname + '/.env' });
class DbFieldMetadata {
    constructor(fields) {
        Object.assign(this, fields);
    }
    ;
}
class DbTableMetadata {
    constructor(name) {
        this.Fields = new Array;
        this.Name = name;
    }
    ;
    AddFields(fields) {
        this.Fields.push(new DbFieldMetadata(fields));
    }
}
class DbDatabaseMetadata {
    constructor() {
        this.Tables = new Array;
    }
    AddTable(tableName) {
        //console.log("AddTable " + tableName)
        this.Tables.push(new DbTableMetadata(tableName));
    }
    AddFields(tableName, fields) {
        //console.log("AddFields " + tableName)
        this.GetTable(tableName).AddFields(fields);
    }
    GetTable(tableName) {
        return this.Tables.find(table => table.Name = tableName);
    }
}
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});
exports.connect = (callback) => {
    connection.connect(callback);
    return connection;
};
function loadFields(meta) {
    return new Promise((resolve, reject) => {
        let promises = new Array;
        meta.Tables.forEach((tableData) => {
            promises.push(new Promise((resolve, reject) => {
                connection.query(`show fields from ${process.env.DB_DATABASE}.${tableData.Name}`, function (err, results, fields) {
                    if (err)
                        reject(err);
                    meta.AddFields(tableData.Name, results);
                    resolve();
                });
            }));
        });
        Promise.all(promises).then(() => {
            resolve(meta);
        }).catch((err) => {
            reject(meta);
        });
    });
}
function loadTables(meta) {
    return new Promise((resolve, reject) => {
        connection.query(`show tables from ${process.env.DB_DATABASE}`, function (err, results, fields) {
            if (err)
                reject(err);
            results.forEach((result) => {
                for (let table in result) {
                    let tableName = result[table];
                    meta.AddTable(tableName);
                }
            });
            resolve(meta);
        });
    });
}
function loadMetadata() {
    return __awaiter(this, void 0, void 0, function* () {
        const meta = yield loadTables(new DbDatabaseMetadata);
        return yield loadFields(meta);
    });
}
exports.test = () => {
    loadMetadata().then((meta) => console.log(JSON.stringify(meta)));
};
exports.getMetadata = (callback) => {
    connection.query(`show tables from ${process.env.DB_DATABASE}`, callback);
};
//# sourceMappingURL=mydb.js.map