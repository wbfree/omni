require('dotenv').config({ path: __dirname + '/.env' })


class DbFieldMetadata {
    public TableName: string;
    public Field: string;
    public Type: string;
    public Null: string;
    public Key: string;
    public Default: string;

    public Referenced_Schema: string;
    public Referenced_Table: string;
    public Referenced_Field: string;

    public constructor(tableName: string, fields: object) {
        this.TableName = tableName
        this.Assign(fields)
    };

    public Assign(obj: object) {
        Object.assign(this, obj)
    }

}

class DbTableMetadata {
    public Name: string
    public Fields: Array<DbFieldMetadata> = new Array<DbFieldMetadata>;

    public constructor(name: string) {
        this.Name = name
    };

    public GetField(fieldName: string): DbFieldMetadata {
        return this.Fields.find(field => field.Field == fieldName)
    }

}

class DbDatabaseMetadata {
    public Tables: Array<DbTableMetadata> = new Array<DbTableMetadata>;
    public constructor() { }

    public GetTable(tableName: string): DbTableMetadata {
        return this.Tables.find(table => table.Name == tableName)
    }
}

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

exports.connect = (callback: any) => {
    connection.connect(callback)
    return connection;
}

class DbDatabaseMetadata_Loader {
    private conn: any
    public constructor(connection: any) {
        this.conn = connection
    }

    private loadKeys(meta: DbDatabaseMetadata): Promise<DbDatabaseMetadata> {
        var keys_query =
            `SELECT us.TABLE_NAME TableName, us.COLUMN_NAME Field,
	        us.REFERENCED_TABLE_SCHEMA Referenced_Schema, 
            us.REFERENCED_TABLE_NAME Referenced_Table, 
            us.REFERENCED_COLUMN_NAME Referenced_Field
        FROM information_schema.KEY_COLUMN_USAGE us
            WHERE TABLE_SCHEMA='${process.env.DB_DATABASE}' and us.REFERENCED_TABLE_SCHEMA IS not null`;

        return new Promise<DbDatabaseMetadata>((resolve, reject) => {
            this.conn.query(keys_query, function (err: object, results: Array<object>, fields: object) {
                if (err) reject(err)
                results.forEach((keys: Object) => {
                    let tableName: string = keys['TableName'];
                    let fieldName: string = keys['Field'];
                    meta.GetTable(tableName).GetField(fieldName).Assign(keys)
                })
                resolve(meta)
            })
        })
    }
    private loadFields(meta: DbDatabaseMetadata): Promise<DbDatabaseMetadata> {
        return new Promise<DbDatabaseMetadata>((resolve, reject) => {
            let promises: Array<Promise<void>> = new Array<Promise<void>>;

            meta.Tables.forEach((tableData: DbTableMetadata) => {
                promises.push(new Promise<void>((resolve, reject) => {
                    var fields_query = `show fields from ${process.env.DB_DATABASE}.${tableData.Name}`
                    this.conn.query(fields_query, function (err: object, results: Array<object>, fields: object) {
                        if (err) reject(err)

                        let table: DbTableMetadata = meta.GetTable(tableData.Name)
                        Object.values(results).map((obj) => {
                            table.Fields.push(new DbFieldMetadata(tableData.Name, obj));
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
    private loadTables(meta: DbDatabaseMetadata): Promise<DbDatabaseMetadata> {
        var table_query = `show tables from ${process.env.DB_DATABASE}`

        return new Promise<DbDatabaseMetadata>((resolve, reject) => {
            this.conn.query(table_query, function (err: object, results: Array<object>, fields: object) {
                if (err) reject(err)
                results.forEach((result: Object) => {
                    for (let table in result) {
                        meta.Tables.push(new DbTableMetadata(result[table]))
                    }
                })
                resolve(meta)
            })
        })
    }

    public static async LoadFromDb(conn: any): Promise<DbDatabaseMetadata> {
        let loader: DbDatabaseMetadata_Loader = new DbDatabaseMetadata_Loader(conn)
        const meta = await loader.loadTables(new DbDatabaseMetadata);
        await loader.loadFields(meta);
        return await loader.loadKeys(meta);
    }

    public static FromJSON(json_data: string): DbDatabaseMetadata {
        return Object.assign(new DbDatabaseMetadata, JSON.parse(json_data))
    }
}

exports.Metadata = async () => {
    return await DbDatabaseMetadata_Loader.LoadFromDb(connection)
}

exports.Get = async (obj: string) => {
    const meta = await exports.Metadata();
}

exports.test = () => {
    DbDatabaseMetadata_Loader.LoadFromDb(connection).then((meta_original: DbDatabaseMetadata) => {
        let json_data: string = JSON.stringify(meta_original);
        let meta_from_json = DbDatabaseMetadata_Loader.FromJSON(json_data)

        console.log(JSON.stringify(meta_from_json))
        //console.log(JSON.stringify(meta))
    })

}
