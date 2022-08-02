export class DbFieldMetadata {
    public SchemaName: string;
    public TableName: string;
    public Field: string | undefined;
    public Type: string | undefined;
    public Null: string | undefined;
    public Key: string | undefined;
    public Default: string | undefined;

    public Referenced_Schema: string | undefined;
    public Referenced_Table: string | undefined;
    public Referenced_Field: string | undefined;

    public constructor(tableName: string, schemaName: string, fields: object) {
        this.SchemaName = schemaName
        this.TableName = tableName
        this.Assign(fields)
    };

    public Assign(obj: object) {
        Object.assign(this, obj)
    }

    public IsFK(): boolean {
        return this.Referenced_Field != null;
    }

    public IsPK(): boolean {
        return this.Key === 'PRI';
    }

    public GetSQLRef(): string {
        return `${this.SchemaName}.${this.TableName}.${this.Field}`
    }

    public GetSQLRefKey(): string {
        return `${this.Referenced_Schema}.${this.Referenced_Table}.${this.Referenced_Field}`
    }

    public GetTable(meta: DbDatabaseMetadata): DbTableMetadata {
        return meta.GetTable(this.TableName, this.SchemaName)
    }

    public GetFkTable(meta: DbDatabaseMetadata): DbTableMetadata {
        return meta.GetTable(this.Referenced_Table, this.Referenced_Schema)
    }

    public static EmptyField(): DbFieldMetadata {
        return new DbFieldMetadata('unknown table', 'unknown schema', new Object)
    }

}

export class DbTableMetadata {
    public SchemaName: string
    public TableName: string
    public Fields: Array<DbFieldMetadata> = new Array<DbFieldMetadata>();

    public constructor(tableName: string, schema: string) {
        this.TableName = tableName
        this.SchemaName = schema
    };

    public GetFieldPK(): DbFieldMetadata {
        return this.Fields.find(field => !field.IsPK() && !field.IsFK()) ?? DbFieldMetadata.EmptyField()
    }

    public GetField(fieldName: string): DbFieldMetadata {
        return this.Fields.find(field => field.Field == fieldName) ?? DbFieldMetadata.EmptyField()
    }

    public GetLookupField(): DbFieldMetadata {
        return this.Fields.find(field => !field.IsFK() && !field.IsPK()) ?? DbFieldMetadata.EmptyField()
    }

    public GetSQLRef(): string {
        return `${this.SchemaName}.${this.TableName}`
    }

    public GetSelectSQL(meta: DbDatabaseMetadata): string {
        let sql_fields: Array<string> = new Array<string>;
        let sql_join: Array<string> = new Array<string>;
        sql_fields.push(`${this.GetSQLRef()}.*`)

        this.Fields.filter((field: DbFieldMetadata) => field.IsFK()).forEach((keyfield: DbFieldMetadata) => {
            let fkTable: DbTableMetadata = keyfield.GetFkTable(meta)

            sql_fields.push(`${fkTable.GetLookupField().GetSQLRef()} as ${keyfield.Field}_lookup`)
            sql_join.push(`left join ${fkTable.GetSQLRef()} on ${keyfield.GetSQLRef()} = ${keyfield.GetSQLRefKey()}`)
        })
        return `Select ${sql_fields.join(',')} from ${this.GetSQLRef()} ${sql_join.join(' ')}`
    }

    public static EmptyTable(): DbTableMetadata {
        return new DbTableMetadata('unknown table', 'unknown schema')
    }

}

export class DbDatabaseMetadata {
    public Tables: Array<DbTableMetadata> = new Array<DbTableMetadata>();
    public constructor() { }

    public GetTable(tableName: string | undefined, schema: string | undefined): DbTableMetadata {
        return this.Tables.find(table => table.TableName == tableName && table.SchemaName == schema) ?? DbTableMetadata.EmptyTable()
    }

    public GetSelectSQL(tableName: string, schema: string): string {
        return this.GetTable(tableName, schema).GetSelectSQL(this)
    }

}

