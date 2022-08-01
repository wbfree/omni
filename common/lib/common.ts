export class DbFieldMetadata {
    public TableName: string;
    public Field: string | undefined;
    public Type: string | undefined;
    public Null: string | undefined;
    public Key: string | undefined;
    public Default: string | undefined;

    public Referenced_Schema: string | undefined;
    public Referenced_Table: string | undefined;
    public Referenced_Field: string | undefined;

    public constructor(tableName: string, fields: object) {
        this.TableName = tableName
        this.Assign(fields)
    };

    public Assign(obj: object) {
        Object.assign(this, obj)
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

    public GetField(fieldName: string): DbFieldMetadata {
        return this.Fields.find(field => field.Field == fieldName) ?? new DbFieldMetadata(this.TableName, new Object)
    }

}

export class DbDatabaseMetadata {
    public Tables: Array<DbTableMetadata> = new Array<DbTableMetadata>();
    public constructor() { }

    public GetTable(tableName: string, schema: string): DbTableMetadata {
        return this.Tables.find(table => table.TableName == tableName && table.SchemaName == schema) ?? new DbTableMetadata('unknown table', 'unknown schema')
    }
}

