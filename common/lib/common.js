"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbDatabaseMetadata = exports.DbTableMetadata = exports.DbFieldMetadata = void 0;
class DbFieldMetadata {
    constructor(tableName, fields) {
        this.TableName = tableName;
        this.Assign(fields);
    }
    ;
    Assign(obj) {
        Object.assign(this, obj);
    }
    IsFK() {
        return this.Referenced_Field != null;
    }
}
exports.DbFieldMetadata = DbFieldMetadata;
class DbTableMetadata {
    constructor(tableName, schema) {
        this.Fields = new Array();
        this.TableName = tableName;
        this.SchemaName = schema;
    }
    ;
    GetField(fieldName) {
        var _a;
        return (_a = this.Fields.find(field => field.Field == fieldName)) !== null && _a !== void 0 ? _a : new DbFieldMetadata(this.TableName, new Object);
    }
    GetSelectSQL() {
        let sql = `select * from ${this.SchemaName}.${this.TableName}`;
        this.Fields.filter((field) => field.IsFK()).forEach((field) => {
            sql += ` left join  ${field.Referenced_Schema}.${field.Referenced_Table} on ${this.SchemaName}.${this.TableName}.${field.Field}=${field.Referenced_Schema}.${field.Referenced_Table}.${field.Referenced_Field}`;
        });
        return sql;
        //        return this.Fields.map((field :DbFieldMetadata)=> field.Field ).join(",")
    }
}
exports.DbTableMetadata = DbTableMetadata;
class DbDatabaseMetadata {
    constructor() {
        this.Tables = new Array();
    }
    GetTable(tableName, schema) {
        var _a;
        return (_a = this.Tables.find(table => table.TableName == tableName && table.SchemaName == schema)) !== null && _a !== void 0 ? _a : new DbTableMetadata('unknown table', 'unknown schema');
    }
}
exports.DbDatabaseMetadata = DbDatabaseMetadata;
