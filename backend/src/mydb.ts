require('dotenv').config({ path: __dirname + '/.env' })


class DbFieldMetadata {
    public Field: string;
    public Type: string;
    public Null: string;
    public Key: string;
    public Default: string;

    public constructor(fields: object) {
        Object.assign(this, fields)
    };

}

class DbTableMetadata {
    public Name: string
    public Fields: Array<DbFieldMetadata> = new Array<DbFieldMetadata>;

    public constructor(name: string) {
        this.Name = name
    };

    public AddFields(fields: object): void {
        this.Fields.push(new DbFieldMetadata(fields));
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
    public GetTable(tableName: string): DbTableMetadata {
        return this.Tables.find(table => table.Name = tableName)
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
                    let tableName: string = result[table];
                    meta.AddTable(tableName);
                }
            })
            resolve(meta)
        })
    })
}

function loadMetadata(): Promise<DbDatabaseMetadata> {
    return loadTables(new DbDatabaseMetadata)
        .then((meta) => { return loadFields(meta) })
}

exports.test = () => {
    loadMetadata().then((meta: DbDatabaseMetadata) => console.log(JSON.stringify(meta)))
}

exports.getMetadata = (callback: any) => {
    connection.query(`show tables from ${process.env.DB_DATABASE}`, callback);
}