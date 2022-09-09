import dotenv from 'dotenv';
import { DatabaseInterface, DatabaseResult, DatabaseError } from './mydb';
import mysql from 'mysql';

dotenv.config({ path: __dirname + '/.env' })

export class DatabaseMySql implements DatabaseInterface {
    private connection: mysql.Connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: 3306
    });

    public Connect(callback: DatabaseError): void {
        this.connection.connect(callback);
    }
    public GetTables(schema: string, callback: DatabaseResult): void {
        const table_query = `show tables from ${schema}`
        this.connection.query(table_query, callback)
    }
    public GetKeys(schema: string, callback: DatabaseResult): void {
        const keys_query =
            `SELECT us.TABLE_SCHEMA SchemaName, us.TABLE_NAME TableName, us.COLUMN_NAME Field,
	        us.REFERENCED_TABLE_SCHEMA Referenced_Schema, 
            us.REFERENCED_TABLE_NAME Referenced_Table, 
            us.REFERENCED_COLUMN_NAME Referenced_Field
        FROM information_schema.KEY_COLUMN_USAGE us
            WHERE TABLE_SCHEMA='${schema}'`;
        this.connection.query(keys_query, callback)

    }
    public GetFields(schema: string, table: string, callback: DatabaseResult): void {
        const fields_query = `show fields from ${schema}.${table}`
        this.connection.query(fields_query, callback)
    }
    public Query(sql: string, callback: DatabaseResult): void {
        this.connection.query(sql, callback)
    }

}
