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
    constructor(tableName, schema) {
        this.Fields = new Array;
        this.TableName = tableName;
        this.SchemaName = schema;
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
    GetTable(tableName, schema) {
        return this.Tables.find(table => table.TableName == tableName && table.SchemaName == schema);
    }
}
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});
exports.connect = (callback) => {
    connection.connect(callback);
    return connection;
};
class DbDatabaseMetadata_Loader {
    constructor(connection) {
        this.conn = connection;
    }
    loadKeys(meta, schema) {
        var keys_query = `SELECT us.TABLE_SCHEMA SchemaName, us.TABLE_NAME TableName, us.COLUMN_NAME Field,
	        us.REFERENCED_TABLE_SCHEMA Referenced_Schema, 
            us.REFERENCED_TABLE_NAME Referenced_Table, 
            us.REFERENCED_COLUMN_NAME Referenced_Field
        FROM information_schema.KEY_COLUMN_USAGE us
            WHERE TABLE_SCHEMA='${schema}'`;
        return new Promise((resolve, reject) => {
            this.conn.query(keys_query, function (err, results, fields) {
                if (err)
                    reject(err);
                results.forEach((keys) => {
                    let schemaName = keys['SchemaName'];
                    let tableName = keys['TableName'];
                    let fieldName = keys['Field'];
                    meta.GetTable(tableName, schemaName).GetField(fieldName).Assign(keys);
                });
                resolve(meta);
            });
        });
    }
    loadFields(meta, schema) {
        return new Promise((resolve, reject) => {
            let promises = new Array;
            let schema_tables = meta.Tables.filter((tableData) => { return tableData.SchemaName == schema; });
            schema_tables.forEach((tableData) => {
                promises.push(new Promise((resolve, reject) => {
                    let fields_query = `show fields from ${schema}.${tableData.TableName}`;
                    this.conn.query(fields_query, function (err, results, fields) {
                        if (err)
                            reject(err);
                        let table = meta.GetTable(tableData.TableName, schema);
                        Object.values(results).map((obj) => {
                            table.Fields.push(new DbFieldMetadata(tableData.TableName, obj));
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
    loadTables(meta, schema) {
        let table_query = `show tables from ${schema}`;
        return new Promise((resolve, reject) => {
            this.conn.query(table_query, function (err, results, fields) {
                if (err)
                    reject(err);
                results.forEach((result) => {
                    for (let table in result) {
                        meta.Tables.push(new DbTableMetadata(result[table], schema));
                    }
                });
                resolve(meta);
            });
        });
    }
    static FromJSON(json_data, meta) {
        return Object.assign(meta, JSON.parse(json_data));
    }
    FromSchema(schema, meta) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadTables(meta, schema);
            yield this.loadFields(meta, schema);
            return yield this.loadKeys(meta, schema);
        });
    }
}
exports.Metadata = () => __awaiter(this, void 0, void 0, function* () {
    let loader = new DbDatabaseMetadata_Loader(connection);
    let meta = yield loader.FromSchema(process.env.DB_DATABASE, new DbDatabaseMetadata);
    return yield loader.FromSchema(process.env.DB_DATABASE_COMMON, meta);
});
class QueryResult {
}
exports.Get = (obj) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        connection.query(`select * from ${process.env.DB_DATABASE}.${obj}`, function (err, results, fields) {
            let query_result = new QueryResult;
            query_result.Err = err;
            query_result.Results = results;
            if (err)
                resolve(query_result);
            new DbDatabaseMetadata_Loader(connection).FromSchema(process.env.DB_DATABASE, new DbDatabaseMetadata).then((meta) => {
                query_result.Metadata = meta.GetTable(obj, process.env.DB_DATABASE);
                resolve(query_result);
            });
        });
    });
});
exports.test = () => {
    let loader = new DbDatabaseMetadata_Loader(connection);
    loader.FromSchema(process.env.DB_DATABASE, new DbDatabaseMetadata)
        .then((meta) => {
        return loader.FromSchema(process.env.DB_DATABASE_COMMON, meta);
    })
        .then((meta) => {
        let json_data = JSON.stringify(meta);
        let meta_from_json = DbDatabaseMetadata_Loader.FromJSON(json_data, new DbDatabaseMetadata);
        console.log(JSON.stringify(meta_from_json));
        //console.log(JSON.stringify(meta))
    });
};
//# sourceMappingURL=mydb.js.map