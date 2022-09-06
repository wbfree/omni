"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Get = exports.GetMetadata = exports.DbDatabaseMetadata_Loader = exports.connection = void 0;
const omni_common_1 = require("omni_common");
const dotenv_1 = __importDefault(require("dotenv"));
const mysql_1 = __importDefault(require("mysql"));
dotenv_1.default.config({ path: __dirname + '/.env' });
exports.connection = mysql_1.default.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: 3306
});
class DbDatabaseMetadata_Loader {
    constructor(connection) {
        this.conn = connection;
    }
    loadKeys(meta, schema) {
        const keys_query = `SELECT us.TABLE_SCHEMA SchemaName, us.TABLE_NAME TableName, us.COLUMN_NAME Field,
	        us.REFERENCED_TABLE_SCHEMA Referenced_Schema, 
            us.REFERENCED_TABLE_NAME Referenced_Table, 
            us.REFERENCED_COLUMN_NAME Referenced_Field
        FROM information_schema.KEY_COLUMN_USAGE us
            WHERE TABLE_SCHEMA='${schema}'`;
        return new Promise((resolve, reject) => {
            this.conn.query(keys_query, function (err, results) {
                if (err)
                    reject(err);
                results.forEach((keys) => {
                    const schemaName = keys['SchemaName'];
                    const tableName = keys['TableName'];
                    const fieldName = keys['Field'];
                    meta.GetTable(tableName, schemaName).GetField(fieldName).Assign(keys);
                });
                resolve(meta);
            });
        });
    }
    loadFields(meta, schema) {
        return new Promise((resolve, reject) => {
            const promises = new Array();
            const schema_tables = meta.Tables.filter((tableData) => { return tableData.SchemaName == schema; });
            schema_tables.forEach((tableData) => {
                promises.push(new Promise((resolve, reject) => {
                    const fields_query = `show fields from ${schema}.${tableData.TableName}`;
                    this.conn.query(fields_query, function (err, results) {
                        if (err)
                            reject(err);
                        const table = meta.GetTable(tableData.TableName, schema);
                        Object.values(results).map((obj) => {
                            table.Fields.push(new omni_common_1.DbFieldMetadata(tableData.TableName, schema, obj));
                        });
                        resolve();
                    });
                }));
            });
            Promise.all(promises).then(() => {
                resolve(meta);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    loadTables(meta, schema) {
        const table_query = `show tables from ${schema}`;
        return new Promise((resolve, reject) => {
            this.conn.query(table_query, function (err, results) {
                if (err)
                    reject(err);
                results.forEach((result) => {
                    for (const table in result) {
                        meta.Tables.push(new omni_common_1.DbTableMetadata(result[table], schema));
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
exports.DbDatabaseMetadata_Loader = DbDatabaseMetadata_Loader;
function GetMetadata() {
    return __awaiter(this, void 0, void 0, function* () {
        const loader = new DbDatabaseMetadata_Loader(exports.connection);
        const meta = yield loader.FromSchema(process.env.DB_DATABASE, new omni_common_1.DbDatabaseMetadata);
        return yield loader.FromSchema(process.env.DB_DATABASE_COMMON, meta);
    });
}
exports.GetMetadata = GetMetadata;
function Get(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            GetMetadata().then((meta) => {
                const table = meta.GetTable(obj, process.env.DB_DATABASE);
                const sql_fields = new Array();
                const sql_join = new Array();
                sql_fields.push(`${table.GetSQLRef()}.*`);
                table.Fields.filter((field) => field.IsFK()).forEach((keyfield) => {
                    const fkTable = keyfield.GetFkTable(meta);
                    sql_fields.push(`${fkTable.GetLookupField().GetSQLRef()} as ${keyfield.Field}_lookup`);
                    sql_join.push(`left join ${fkTable.GetSQLRef()} on ${keyfield.GetSQLRef()} = ${keyfield.GetSQLRefKey()}`);
                });
                const sql = `Select ${sql_fields.join(',')} from ${table.GetSQLRef()} ${sql_join.join(' ')}`;
                exports.connection.query(sql, function (err, results) {
                    const query_result = new omni_common_1.QueryResult(meta.GetTable(obj, process.env.DB_DATABASE), results);
                    query_result.Err = err;
                    query_result.SQL = sql;
                    resolve(query_result);
                });
            });
        });
    });
}
exports.Get = Get;
//# sourceMappingURL=mydb.js.map