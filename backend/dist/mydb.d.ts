import { DbDatabaseMetadata, QueryResult } from 'omni_common';
export declare module myDb {
    function connect(callback: any): any;
    class DbDatabaseMetadata_Loader {
        private conn;
        constructor(connection: any);
        private loadKeys;
        private loadFields;
        private loadTables;
        static FromJSON(json_data: string, meta: DbDatabaseMetadata): DbDatabaseMetadata;
        FromSchema(schema: string, meta: DbDatabaseMetadata): Promise<DbDatabaseMetadata>;
    }
    function GetMetadata(): Promise<DbDatabaseMetadata>;
    function Get(obj: string): Promise<QueryResult>;
    function test(): void;
}
