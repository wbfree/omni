require('dotenv').config({ path: __dirname + '/.env' });
class DbFieldMetadata {
    constructor(fields) {
        Object.assign(this, fields);
        for (var key in fields) {
            if (this.hasOwnProperty(key)) {
                this[key] = fields[key];
            }
        }
    }
    ;
}
class DbTableMetadata {
    constructor() {
        this.Fields = new Array;
    }
    ;
    AddFields(fields) {
        this.Fields.push(new DbFieldMetadata(fields));
    }
}
class DbDatabaseMetadata {
    constructor() {
        this.Tables = new Map;
    }
    AddTable(tableName) {
        this.Tables[tableName] = new DbTableMetadata;
    }
    AddFields(tableName, fields) {
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
exports.connect = (callback) => {
    connection.connect(callback);
    return connection;
};
exports.test = () => {
    let meta = new DbDatabaseMetadata;
    const onError = (err => console.log(err));
    connection.query(`show tables from ${process.env.DB_DATABASE}`, function (err, results, fields) {
        results.forEach((result) => {
            for (let table in result) {
                let tableName = result[table];
                meta.AddTable(tableName);
            }
            meta.Tables.forEach((table, tableName) => {
                connection.query(`show fields from ${process.env.DB_DATABASE}.${tableName}`, function (err, results, fields) {
                    meta.AddFields(tableName, results);
                    console.log(JSON.stringify(meta));
                });
            });
        });
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
};
exports.getMetadata = (callback) => {
    connection.query(`show tables from ${process.env.DB_DATABASE}`, callback);
};
//# sourceMappingURL=mydb.js.map