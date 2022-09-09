import { DbDatabaseMetadata, DbTableMetadata, DbFieldMetadata, QueryResult } from 'omni_common'

export interface DatabaseResult {
    (err: object, results: Array<object>): void;
}
export interface DatabaseError {
    (err: string): void;
}

export abstract class DatabaseInterface {
    public abstract Connect(callback: DatabaseError): void;
    public abstract GetTables(schema: string, callback: DatabaseResult): void;
    public abstract GetKeys(schema: string, callback: DatabaseResult): void;
    public abstract GetFields(schema: string, table: string, callback: DatabaseResult): void;
    public abstract Query(sql: string, callback: DatabaseResult): void;
}

export class DbDatabaseMetadata_Loader {
    private conn: DatabaseInterface

    public constructor(connection: DatabaseInterface) {
        this.conn = connection
    }

    private loadKeys(meta: DbDatabaseMetadata, schema: string): Promise<DbDatabaseMetadata> {
        return new Promise<DbDatabaseMetadata>((resolve, reject) => {
            this.conn.GetKeys(schema, function (err: object, results: Array<object>) {
                if (err) reject(err)
                results.forEach((keys: object) => {
                    const schemaName: string = keys['SchemaName'];
                    const tableName: string = keys['TableName'];
                    const fieldName: string = keys['Field'];

                    meta.GetTable(tableName, schemaName).GetField(fieldName).Assign(keys)
                })
                resolve(meta)
            })
        })
    }
    private loadFields(meta: DbDatabaseMetadata, schema: string): Promise<DbDatabaseMetadata> {
        return new Promise<DbDatabaseMetadata>((resolve, reject) => {
            const promises: Array<Promise<void>> = new Array<Promise<void>>();
            const schema_tables: Array<DbTableMetadata> = meta.Tables.filter((tableData: DbTableMetadata) => { return tableData.SchemaName == schema })

            schema_tables.forEach((tableData: DbTableMetadata) => {
                promises.push(new Promise<void>((resolve, reject) => {
                    this.conn.GetFields(schema, tableData.TableName, function (err: object, results: Array<object>) {
                        if (err) reject(err)

                        const table: DbTableMetadata = meta.GetTable(tableData.TableName, schema)
                        Object.values(results).map((obj) => {
                            table.Fields.push(new DbFieldMetadata(tableData.TableName, schema, obj));
                        })
                        resolve()
                    })
                }))
            })

            Promise.all(promises).then(() => {
                resolve(meta)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    private loadTables(meta: DbDatabaseMetadata, schema: string): Promise<DbDatabaseMetadata> {
        return new Promise<DbDatabaseMetadata>((resolve, reject) => {
            this.conn.GetTables(schema, function (err: object, results: Array<object>) {
                if (err) reject(err)
                results.forEach((result: object) => {
                    for (const table in result) {
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

export async function GetMetadata(conn: DatabaseInterface): Promise<DbDatabaseMetadata> {
    const loader = new DbDatabaseMetadata_Loader(conn);
    const meta = await loader.FromSchema(process.env.DB_DATABASE, new DbDatabaseMetadata)
    return await loader.FromSchema(process.env.DB_DATABASE_COMMON, meta)
}

export async function Get(conn: DatabaseInterface, obj: string): Promise<QueryResult> {
    return new Promise((resolve) => {
        GetMetadata(conn).then((meta: DbDatabaseMetadata) => {
            const table: DbTableMetadata = meta.GetTable(obj, process.env.DB_DATABASE)

            const sql_fields: Array<string> = new Array<string>();
            const sql_join: Array<string> = new Array<string>();
            sql_fields.push(`${table.GetSQLRef()}.*`)

            table.Fields.filter((field: DbFieldMetadata) => field.IsFK()).forEach((keyfield: DbFieldMetadata) => {
                const fkTable: DbTableMetadata = keyfield.GetFkTable(meta)

                sql_fields.push(`${fkTable.GetLookupField().GetSQLRef()} as ${keyfield.Field}_lookup`)
                sql_join.push(`left join ${fkTable.GetSQLRef()} on ${keyfield.GetSQLRef()} = ${keyfield.GetSQLRefKey()}`)
            })
            const sql = `Select ${sql_fields.join(',')} from ${table.GetSQLRef()} ${sql_join.join(' ')}`

            conn.Query(sql, function (err: object, results: Array<object>) {
                const query_result = new QueryResult(meta.GetTable(obj, process.env.DB_DATABASE), results)
                query_result.Err = err
                query_result.SQL = sql

                resolve(query_result)
            })
        })
    })
}

