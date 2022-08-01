import { DbDatabaseMetadata, DbTableMetadata, DbFieldMetadata } from 'omni_common'
require('dotenv').config({ path: __dirname + '/.env' })

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});


export module myDb {

    export function connect(callback: any) {
        connection.connect(callback)
        return connection;
    }

    export class DbDatabaseMetadata_Loader {
        private conn: any

        public constructor(connection: any) {
            this.conn = connection
        }

        private loadKeys(meta: DbDatabaseMetadata, schema: string): Promise<DbDatabaseMetadata> {
            var keys_query =
                `SELECT us.TABLE_SCHEMA SchemaName, us.TABLE_NAME TableName, us.COLUMN_NAME Field,
	        us.REFERENCED_TABLE_SCHEMA Referenced_Schema, 
            us.REFERENCED_TABLE_NAME Referenced_Table, 
            us.REFERENCED_COLUMN_NAME Referenced_Field
        FROM information_schema.KEY_COLUMN_USAGE us
            WHERE TABLE_SCHEMA='${schema}'`;

            return new Promise<DbDatabaseMetadata>((resolve, reject) => {
                this.conn.query(keys_query, function (err: object, results: Array<object>, fields: object) {
                    if (err) reject(err)
                    results.forEach((keys: Object) => {
                        let schemaName: string = keys['SchemaName'];
                        let tableName: string = keys['TableName'];
                        let fieldName: string = keys['Field'];
                        meta.GetTable(tableName, schemaName).GetField(fieldName).Assign(keys)
                    })
                    resolve(meta)
                })
            })
        }
        private loadFields(meta: DbDatabaseMetadata, schema: string): Promise<DbDatabaseMetadata> {
            return new Promise<DbDatabaseMetadata>((resolve, reject) => {
                let promises: Array<Promise<void>> = new Array<Promise<void>>();
                let schema_tables: Array<DbTableMetadata> = meta.Tables.filter((tableData: DbTableMetadata) => { return tableData.SchemaName == schema })

                schema_tables.forEach((tableData: DbTableMetadata) => {
                    promises.push(new Promise<void>((resolve, reject) => {
                        let fields_query = `show fields from ${schema}.${tableData.TableName}`
                        this.conn.query(fields_query, function (err: object, results: Array<object>, fields: object) {
                            if (err) reject(err)

                            let table: DbTableMetadata = meta.GetTable(tableData.TableName, schema)
                            Object.values(results).map((obj) => {
                                table.Fields.push(new DbFieldMetadata(tableData.TableName, obj));
                            })
                            resolve()
                        })
                    }))
                })

                Promise.all(promises).then(() => {
                    resolve(meta)
                }).catch((err) => {
                    reject(meta)
                })
            })
        }
        private loadTables(meta: DbDatabaseMetadata, schema: string): Promise<DbDatabaseMetadata> {
            let table_query = `show tables from ${schema}`

            return new Promise<DbDatabaseMetadata>((resolve, reject) => {
                this.conn.query(table_query, function (err: object, results: Array<object>, fields: object) {
                    if (err) reject(err)
                    results.forEach((result: Object) => {
                        for (let table in result) {
                            meta.Tables.push(new DbTableMetadata(result[table], schema))
                        }
                    })
                    resolve(meta)
                })
            })
        }


        public static FromJSON(json_data: string, meta: DbDatabaseMetadata): DbDatabaseMetadata {
            return Object.assign(meta, JSON.parse(json_data))
        }

        public async FromSchema(schema: string, meta: DbDatabaseMetadata): Promise<DbDatabaseMetadata> {
            await this.loadTables(meta, schema);
            await this.loadFields(meta, schema);
            return await this.loadKeys(meta, schema);
        }
    }

    export async function Metadata(): Promise<DbDatabaseMetadata> {
        let loader = new DbDatabaseMetadata_Loader(connection);
        let meta = await loader.FromSchema(process.env.DB_DATABASE, new DbDatabaseMetadata)
        return await loader.FromSchema(process.env.DB_DATABASE_COMMON, meta)
    }

    export class QueryResult {
        public Err: object
        public Results: Array<object>
        public Metadata: DbTableMetadata;
        public SQL :string;

    }

    export async function Get(obj: string): Promise<QueryResult> {
        return new Promise((resolve, reject) => {
            new DbDatabaseMetadata_Loader(connection).FromSchema(process.env.DB_DATABASE, new DbDatabaseMetadata).then((meta :DbDatabaseMetadata )=> {
                let table :DbTableMetadata = meta.GetTable(obj, process.env.DB_DATABASE)
                
                connection.query(table.GetSelectSQL(), function (err: object, results: Array<object>, fields: object) {
                    let query_result = new QueryResult;
                    query_result.Metadata = table
                    query_result.Err = err
                    query_result.Results = results
                    query_result.SQL = table.GetSelectSQL()
    
                    resolve(query_result)
                    })
            }) 
        })
    }

    export function test() {
        let loader = new DbDatabaseMetadata_Loader(connection);

        loader.FromSchema(process.env.DB_DATABASE, new DbDatabaseMetadata)
            .then((meta: DbDatabaseMetadata) => {
                return loader.FromSchema(process.env.DB_DATABASE_COMMON, meta)
            })
            .then((meta: DbDatabaseMetadata) => {
                let json_data: string = JSON.stringify(meta);
                let meta_from_json = DbDatabaseMetadata_Loader.FromJSON(json_data, new DbDatabaseMetadata)

                console.log(JSON.stringify(meta_from_json))
                //console.log(JSON.stringify(meta))
            })
    }
}
