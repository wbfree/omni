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
        this.Assign(fields);
    }
    ;
    Assign(obj) {
        Object.assign(this, obj);
    }
}
class DbTableMetadata {
    constructor(name) {
        this.Fields = new Array;
        this.Name = name;
    }
    ;
    GetField(fieldName) {
        return this.Fields.find(field => field.Field == fieldName);
    }
}
class DbDatabaseMetadata {
    constructor() {
        this.Tables = new Array;
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
class DbDatabaseMetadata_Loader {
    constructor(connection) {
        this.conn = connection;
    }
    loadKeys(meta) {
        var keys_query = `SELECT us.TABLE_NAME TableName, us.COLUMN_NAME Field,
	        us.REFERENCED_TABLE_SCHEMA Referenced_Schema, 
            us.REFERENCED_TABLE_NAME Referenced_Table, 
            us.REFERENCED_COLUMN_NAME Referenced_Field
        FROM information_schema.KEY_COLUMN_USAGE us
            WHERE TABLE_SCHEMA='${process.env.DB_DATABASE}' and us.REFERENCED_TABLE_SCHEMA IS not null`;
        return new Promise((resolve, reject) => {
            this.conn.query(keys_query, function (err, results, fields) {
                if (err)
                    reject(err);
                results.forEach((keys) => {
                    let tableName = keys['TableName'];
                    let fieldName = keys['Field'];
                    meta.GetTable(tableName).GetField(fieldName).Assign(keys);
                });
                resolve(meta);
            });
        });
    }
    loadFields(meta) {
        return new Promise((resolve, reject) => {
            let promises = new Array;
            meta.Tables.forEach((tableData) => {
                promises.push(new Promise((resolve, reject) => {
                    var fields_query = `show fields from ${process.env.DB_DATABASE}.${tableData.Name}`;
                    this.conn.query(fields_query, function (err, results, fields) {
                        if (err)
                            reject(err);
                        let table = meta.GetTable(tableData.Name);
                        Object.values(results).map((obj) => {
                            table.Fields.push(new DbFieldMetadata(tableData.Name, obj));
                        });
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
    loadTables(meta) {
        var table_query = `show tables from ${process.env.DB_DATABASE}`;
        return new Promise((resolve, reject) => {
            this.conn.query(table_query, function (err, results, fields) {
                if (err)
                    reject(err);
                results.forEach((result) => {
                    for (let table in result) {
                        meta.Tables.push(new DbTableMetadata(result[table]));
                    }
                });
                resolve(meta);
            });
        });
    }
    static LoadFromDb(conn) {
        return __awaiter(this, void 0, void 0, function* () {
            let loader = new DbDatabaseMetadata_Loader(conn);
            const meta = yield loader.loadTables(new DbDatabaseMetadata);
            yield loader.loadFields(meta);
            return yield loader.loadKeys(meta);
        });
    }
    static FromJSON(json_data) {
        return Object.assign(new DbDatabaseMetadata, JSON.parse(json_data));
    }
}
exports.Metadata = () => __awaiter(this, void 0, void 0, function* () {
    return yield DbDatabaseMetadata_Loader.LoadFromDb(connection);
});
class QueryResult {
}
exports.Get = (obj) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        connection.query(`select * from ${obj}`, function (err, results, fields) {
            let query_result = new QueryResult;
            query_result.Err = err;
            query_result.Results = results;
            if (err)
                resolve(query_result);
            DbDatabaseMetadata_Loader.LoadFromDb(connection).then((meta) => {
                query_result.Metadata = meta.GetTable(obj);
                resolve(query_result);
            });
        });
    });
});
exports.test = () => {
    DbDatabaseMetadata_Loader.LoadFromDb(connection).then((meta_original) => {
        let json_data = JSON.stringify(meta_original);
        let meta_from_json = DbDatabaseMetadata_Loader.FromJSON(json_data);
        console.log(JSON.stringify(meta_from_json));
        //console.log(JSON.stringify(meta))
    });
};
//# sourceMappingURL=mydb.js.map