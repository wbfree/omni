declare class DbFieldMetadata {
    TableName: string;
    Field: string;
    Type: string;
    Null: string;
    Key: string;
    Default: string;
    Referenced_Schema: string;
    Referenced_Table: string;
    Referenced_Field: string;
    constructor(tableName: string, fields: object);
    Assign(obj: object): void;
}
declare class DbTableMetadata {
    SchemaName: string;
    TableName: string;
    Fields: Array<DbFieldMetadata>;
    constructor(tableName: string, schema: string);
    GetField(fieldName: string): DbFieldMetadata;
}
declare class DbDatabaseMetadata {
    Tables: Array<DbTableMetadata>;
    constructor();
    GetTable(tableName: string, schema: string): DbTableMetadata;
}
declare var mysql: any;
declare var connection: any;
declare class DbDatabaseMetadata_Loader {
    private conn;
    constructor(connection: any);
    private loadKeys;
    private loadFields;
    private loadTables;
    static FromJSON(json_data: string, meta: DbDatabaseMetadata): DbDatabaseMetadata;
    FromSchema(schema: string, meta: DbDatabaseMetadata): Promise<DbDatabaseMetadata>;
}
declare class QueryResult {
    Err: object;
    Results: Array<object>;
    Metadata: DbTableMetadata;
}
