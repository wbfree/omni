"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbDatabaseMetadata = exports.DbTableMetadata = exports.DbFieldMetadata = void 0;
class DbFieldMetadata {
    constructor(tableName, schemaName, fields) {
        this.SchemaName = schemaName;
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
    IsPK() {
        return this.Key === 'PRI';
    }
    GetSQLRef() {
        return `${this.SchemaName}.${this.TableName}.${this.Field}`;
    }
    GetSQLRefKey() {
        return `${this.Referenced_Schema}.${this.Referenced_Table}.${this.Referenced_Field}`;
    }
    GetTable(meta) {
        return meta.GetTable(this.TableName, this.SchemaName);
    }
    GetFkTable(meta) {
        return meta.GetTable(this.Referenced_Table, this.Referenced_Schema);
    }
    static EmptyField() {
        return new DbFieldMetadata('unknown table', 'unknown schema', new Object);
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
    GetFieldPK() {
        var _a;
        return (_a = this.Fields.find(field => !field.IsPK() && !field.IsFK())) !== null && _a !== void 0 ? _a : DbFieldMetadata.EmptyField();
    }
    GetField(fieldName) {
        var _a;
        return (_a = this.Fields.find(field => field.Field == fieldName)) !== null && _a !== void 0 ? _a : DbFieldMetadata.EmptyField();
    }
    GetLookupField() {
        var _a;
        return (_a = this.Fields.find(field => !field.IsFK() && !field.IsPK())) !== null && _a !== void 0 ? _a : DbFieldMetadata.EmptyField();
    }
    GetSQLRef() {
        return `${this.SchemaName}.${this.TableName}`;
    }
    GetSelectSQL(meta) {
        let sql_fields = new Array;
        let sql_join = new Array;
        sql_fields.push(`${this.GetSQLRef()}.*`);
        this.Fields.filter((field) => field.IsFK()).forEach((keyfield) => {
            let fkTable = keyfield.GetFkTable(meta);
            sql_fields.push(`${fkTable.GetLookupField().GetSQLRef()} as ${keyfield.Field}_lookup`);
            sql_join.push(`left join ${fkTable.GetSQLRef()} on ${keyfield.GetSQLRef()} = ${keyfield.GetSQLRefKey()}`);
        });
        return `Select ${sql_fields.join(',')} from ${this.GetSQLRef()} ${sql_join.join(' ')}`;
    }
    static EmptyTable() {
        return new DbTableMetadata('unknown table', 'unknown schema');
    }
}
exports.DbTableMetadata = DbTableMetadata;
class DbDatabaseMetadata {
    constructor() {
        this.Tables = new Array();
    }
    GetTable(tableName, schema) {
        var _a;
        return (_a = this.Tables.find(table => table.TableName == tableName && table.SchemaName == schema)) !== null && _a !== void 0 ? _a : DbTableMetadata.EmptyTable();
    }
    GetSelectSQL(tableName, schema) {
        return this.GetTable(tableName, schema).GetSelectSQL(this);
    }
}
exports.DbDatabaseMetadata = DbDatabaseMetadata;
