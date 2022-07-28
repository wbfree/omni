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
    connection.query(`show tables from ${process.env.DB_DATABASE}`, function (err, results, fields) {
        let promises = new Array;
        results.forEach((result) => {
            for (let table in result) {
                let tableName = result[table];
                meta.AddTable(tableName);
                promises.push(new Promise((resolve, reject) => {
                    connection.query(`show fields from ${process.env.DB_DATABASE}.${tableName}`, function (err, results, fields) {
                        if (err)
                            reject(err);
                        meta.AddFields(tableName, results);
                        resolve();
                    });
                }));
            }
        });
        Promise.all(promises).then(() => {
            console.log(JSON.stringify(meta));
        }).catch((err) => {
            console.log(err);
        });
    });
};
exports.getMetadata = (callback) => {
    connection.query(`show tables from ${process.env.DB_DATABASE}`, callback);
};
//# sourceMappingURL=mydb.js.map