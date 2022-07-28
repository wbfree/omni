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
        Object.assign(this, fields)
    };

    public AddKey(keys: object): void {
        Object.assign(this, keys)
    }

}

class DbTableMetadata {
    public Name: string
    public Fields: Array<DbFieldMetadata> = new Array<DbFieldMetadata>;

    public constructor(name: string) {
        this.Name = name
    };

    public AddFields(fields: object): void {
        Object.values(fields).map((obj) => {
            this.Fields.push(new DbFieldMetadata(this.Name, obj));
        })
    }
    public AddKey(fieldName: string, key: object): void {
        this.GetField(fieldName).AddKey(key)
    }
    public GetField(fieldName: string): DbFieldMetadata {
        return this.Fields.find(field => field.Field == fieldName)
    }

}

class DbDatabaseMetadata {
    public Tables: Array<DbTableMetadata> = new Array<DbTableMetadata>;
    public constructor() { }

    public AddTable(tableName: string): void {
        //console.log("AddTable " + tableName)
        this.Tables.push(new DbTableMetadata(tableName))
    }
    public AddFields(tableName: string, fields: object): void {
        //console.log("AddFields " + tableName)
        this.GetTable(tableName).AddFields(fields)
    }
    public AddKeys(tableName: string, fieldName: string, key: object): void {
        //console.log("AddKeys " + tableName + keys)
        this.GetTable(tableName).AddKey(fieldName, key)
    }
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

function loadKeys(meta: DbDatabaseMetadata): Promise<DbDatabaseMetadata> {
    var keys_query =
        `SELECT us.TABLE_NAME TableName, us.COLUMN_NAME Field,
	        us.REFERENCED_TABLE_SCHEMA Referenced_Schema, 
            us.REFERENCED_TABLE_NAME Referenced_Table, 
            us.REFERENCED_COLUMN_NAME Referenced_Field
        FROM information_schema.KEY_COLUMN_USAGE us
            WHERE TABLE_SCHEMA='${process.env.DB_DATABASE}' and us.REFERENCED_TABLE_SCHEMA IS not null`;

    return new Promise<DbDatabaseMetadata>((resolve, reject) => {
        connection.query(keys_query, function (err: object, results: Array<object>, fields: object) {
            if (err) reject(err)
            results.forEach((keys: Object) => {
                let tableName: string = keys['TableName'];
                let fieldName: string = keys['Field'];
                meta.AddKeys(tableName, fieldName, keys);
            })
            resolve(meta)
        })
    })
}

function loadFields(meta: DbDatabaseMetadata): Promise<DbDatabaseMetadata> {
    return new Promise<DbDatabaseMetadata>((resolve, reject) => {
        let promises: Array<Promise<void>> = new Array<Promise<void>>;

        meta.Tables.forEach((tableData: DbTableMetadata) => {
            promises.push(new Promise<void>((resolve, reject) => {
                connection.query(`show fields from ${process.env.DB_DATABASE}.${tableData.Name}`, function (err: object, results: Array<object>, fields: object) {
                    if (err) reject(err)
                    meta.AddFields(tableData.Name, results);
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

function loadTables(meta: DbDatabaseMetadata): Promise<DbDatabaseMetadata> {
    return new Promise<DbDatabaseMetadata>((resolve, reject) => {
        connection.query(`show tables from ${process.env.DB_DATABASE}`, function (err: object, results: Array<object>, fields: object) {
            if (err) reject(err)
            results.forEach((result: Object) => {
                for (let table in result) {
                    meta.AddTable(result[table]);
                }
            })
            resolve(meta)
        })
    })
}

async function loadMetadata(): Promise<DbDatabaseMetadata> {
    const meta = await loadTables(new DbDatabaseMetadata);
    await loadFields(meta);
    return await loadKeys(meta);
}

exports.Metadata = () => {
    return loadMetadata()
}

exports.test = () => {
    loadMetadata().then((meta_original: DbDatabaseMetadata) => {
        let json_data: string = JSON.stringify(meta_original);
        let meta_from_json = Object.assign(new DbDatabaseMetadata, JSON.parse(json_data))

        console.log(JSON.stringify(meta_from_json))
        //console.log(JSON.stringify(meta))
    })

}

exports.getMetadata = (callback: any) => {
    connection.query(`show tables from ${process.env.DB_DATABASE}`, callback);
}