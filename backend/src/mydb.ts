require('dotenv').config({path: __dirname + '/.env'})


class DbFieldMetadata {
    public constructor() {};


}

class DbTableMetadata {
    public constructor() {};
    private Fields :Map<string,DbFieldMetadata> = new Map<string,DbFieldMetadata>;

    public AddFields(fieldName :string, fields :object) :void {
        this.Fields[fieldName]=new DbFieldMetadata;
    }

}

class DbDatabaseMetadata {
    private Tables :Map<string,DbTableMetadata> = new Map<string,DbTableMetadata>;
    public constructor() {}

    public AddTable(tableName :string) :void {
        this.Tables[tableName]=new DbTableMetadata;
    }
    public AddFields(tableName :string, fields :object) :void {
        let fieldName :string = fields['Field'];
        this.Tables[tableName].AddFields(fieldName,fields);
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

    connection.query(`show tables from ${process.env.DB_DATABASE}`)
        .on('error', onError)
        .on('result', (result :any)=>{
            for (let key in result) {
                let tableName :string = result[key]; 
                meta.AddTable(tableName);
    
                connection.query(`show fields from ${tableName}`)
                    .on('error', onError)
                    .on('result', (result :any)=>{
                        meta.AddFields(tableName, result);
                });
            }        
        })
        .on('end', ()=>{ console.log(JSON.stringify(meta))});
}

exports.getMetadata = (callback :any) => {    
    connection.query(`show tables from ${process.env.DB_DATABASE}`, callback );
}