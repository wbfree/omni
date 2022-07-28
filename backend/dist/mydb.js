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
    constructor(tableName, fields) {
        this.TableName = tableName;
        Object.assign(this, fields);
    }
    ;
    AddKey(keys) {
        Object.assign(this, keys);
    }
}
class DbTableMetadata {
    constructor(name) {
        this.Fields = new Array;
        this.Name = name;
    }
    ;
    AddFields(fields) {
        Object.values(fields).map((obj) => {
            this.Fields.push(new DbFieldMetadata(this.Name, obj));
        });
    }
    AddKey(fieldName, key) {
        this.GetField(fieldName).AddKey(key);
    }
    GetField(fieldName) {
        return this.Fields.find(field => field.Field == fieldName);
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
    AddKeys(tableName, fieldName, key) {
        //console.log("AddKeys " + tableName + keys)
        this.GetTable(tableName).AddKey(fieldName, key);
    }
    GetTable(tableName) {
        return this.Tables.find(table => table.Name == tableName);
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
function loadKeys(meta) {
    var keys_query = `SELECT us.TABLE_NAME TableName, us.COLUMN_NAME Field,
	        us.REFERENCED_TABLE_SCHEMA Referenced_Schema, 
            us.REFERENCED_TABLE_NAME Referenced_Table, 
            us.REFERENCED_COLUMN_NAME Referenced_Field
        FROM information_schema.KEY_COLUMN_USAGE us
            WHERE TABLE_SCHEMA='${process.env.DB_DATABASE}' and us.REFERENCED_TABLE_SCHEMA IS not null`;
    return new Promise((resolve, reject) => {
        connection.query(keys_query, function (err, results, fields) {
            if (err)
                reject(err);
            results.forEach((keys) => {
                let tableName = keys['TableName'];
                let fieldName = keys['Field'];
                meta.AddKeys(tableName, fieldName, keys);
            });
            resolve(meta);
        });
    });
}
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
                    meta.AddTable(result[table]);
                }
            });
            resolve(meta);
        });
    });
}
function loadMetadata() {
    return __awaiter(this, void 0, void 0, function* () {
        const meta = yield loadTables(new DbDatabaseMetadata);
        yield loadFields(meta);
        return yield loadKeys(meta);
    });
}
exports.Metadata = () => {
    return loadMetadata();
};
exports.test = () => {
    loadMetadata().then((meta) => console.log(JSON.stringify(meta)));
};
exports.getMetadata = (callback) => {
    connection.query(`show tables from ${process.env.DB_DATABASE}`, callback);
};
//# sourceMappingURL=mydb.js.map