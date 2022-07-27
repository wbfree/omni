require('dotenv').config({ path: __dirname + '/.env' });
class DbFieldMetadata {
    constructor() { }
    ;
}
class DbTableMetadata {
    constructor() {
        this.Fields = new Map;
    }
    ;
    AddFields(fieldName, fields) {
        this.Fields[fieldName] = new DbFieldMetadata;
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
        let fieldName = fields['Field'];
        this.Tables[tableName].AddFields(fieldName, fields);
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
    connection.query(`show tables from ${process.env.DB_DATABASE}`)
        .on('error', onError)
        .on('result', (result) => {
        for (let key in result) {
            let tableName = result[key];
            meta.AddTable(tableName);
            connection.query(`show fields from ${tableName}`)
                .on('error', onError)
                .on('result', (result) => {
                meta.AddFields(tableName, result);
            });
        }
    })
        .on('end', () => { console.log(JSON.stringify(meta)); });
};
exports.getMetadata = (callback) => {
    connection.query(`show tables from ${process.env.DB_DATABASE}`, callback);
};
//# sourceMappingURL=mydb.js.map