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
    Name: string;
    Fields: Array<DbFieldMetadata>;
    constructor(name: string);
    GetField(fieldName: string): DbFieldMetadata;
}
declare class DbDatabaseMetadata {
    Tables: Array<DbTableMetadata>;
    constructor();
    GetTable(tableName: string): DbTableMetadata;
}
declare var mysql: any;
declare var connection: any;
declare class DbDatabaseMetadata_Loader {
    private conn;
    constructor(connection: any);
    private loadKeys;
    private loadFields;
    private loadTables;
    static LoadFromDb(conn: any): Promise<DbDatabaseMetadata>;
    static FromJSON(json_data: string): DbDatabaseMetadata;
}
declare class QueryResult {
    Err: object;
    Results: Array<object>;
    Metadata: DbTableMetadata;
}
