require('dotenv').config({path: __dirname + '/.env'})


class DbFieldMetadata {
    public Field :string;
    public Type :string;
    public Null :string;
    public Key :string;
    public Default :string;

    public constructor(fields :object) {
        Object.assign(this,fields)

        for (var key in fields) {
            if (this.hasOwnProperty(key)) {
                this[key] = fields[key];
            }
        }    
    };

}

class DbTableMetadata {
    public constructor() {};
    public Fields :Array<DbFieldMetadata> = new Array<DbFieldMetadata>;

    public AddFields(fields :object) :void {
        this.Fields.push(new DbFieldMetadata(fields));
    }

}

class DbDatabaseMetadata {
    public Tables :Map<string,DbTableMetadata> = new Map<string,DbTableMetadata>;
    public constructor() {}

    public AddTable(tableName :string) :void {
        this.Tables[tableName]=new DbTableMetadata;
    }
    public AddFields(tableName :string, fields :object) :void {
        this.Tables[tableName].AddFields(fields);
    }

}

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});      

exports.connect = (callback :any) => {
    connection.connect(callback)
    return connection;
}

exports.test = () => {
    let meta = new DbDatabaseMetadata;

    const onError = (err => console.log(err));


    connection.query(`show tables from ${process.env.DB_DATABASE}`, function (err: object, results: Array<object>, fields: object) {
        results.forEach((result :Object) => {

            for (let table in result) {
                let tableName :string = result[table]; 
                meta.AddTable(tableName);
    
            }
            meta.Tables.forEach((table :DbTableMetadata, tableName: string) => {
                connection.query(`show fields from ${process.env.DB_DATABASE}.${tableName}`, function (err: object, results: Array<object>, fields: object) {
                    meta.AddFields(tableName, results);
                    console.log(JSON.stringify(meta))  
                })
            })
        })
    });
    

/*
    connection.query(`show tables from ${process.env.DB_DATABASE}`)
        .on('error', onError)
        .on('result', (result :any)=>{
            let tables_count = Object.keys(result).length
            console.log(tables_count)
            for (let key in result) {
                let tableName :string = result[key]; 
                meta.AddTable(tableName);
    
                connection.query(`show fields from ${process.env.DB_DATABASE}.${tableName}`)
                    .on('error', onError)
                    .on('result', (result :any)=>{
                        meta.AddFields(tableName, result);
                    })
                    .on('end', ()=>{ 
                        //console.log(JSON.stringify(meta)) 
                    });
            }
                    
        });
*/
    }

exports.getMetadata = (callback :any) => {    
    connection.query(`show tables from ${process.env.DB_DATABASE}`, callback );
}