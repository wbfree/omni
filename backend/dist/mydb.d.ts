import { DbDatabaseMetadata, QueryResult } from 'omni_common';
import mysql from 'mysql';
export declare const connection: mysql.Connection;
export declare class DbDatabaseMetadata_Loader {
    private conn;
    constructor(connection: mysql.Connection);
    private loadKeys;
    private loadFields;
    private loadTables;
    static FromJSON(json_data: string, meta: DbDatabaseMetadata): DbDatabaseMetadata;
    FromSchema(schema: string, meta: DbDatabaseMetadata): Promise<DbDatabaseMetadata>;
}
export declare function GetMetadata(): Promise<DbDatabaseMetadata>;
export declare function Get(obj: string): Promise<QueryResult>;
