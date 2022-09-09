import { GetMetadata, DbDatabaseMetadata_Loader } from './mydb';
import { DatabaseMySql } from './mydb.mysql';
import { DbDatabaseMetadata } from 'omni_common'

test('Metadata serializer', done => {
    const conn: DatabaseMySql = new DatabaseMySql

    function callback(err: string) {
        done()
        /*
                GetMetadata(conn)
                    .then((meta: DbDatabaseMetadata) => {
                        done()
                        const json_data: string = JSON.stringify(meta);
                        const meta_from_json = DbDatabaseMetadata_Loader.FromJSON(json_data, new DbDatabaseMetadata)
        
                        console.log(JSON.stringify(meta_from_json))
                        //console.log(JSON.stringify(meta))
                    })
                */
    }

    conn.Connect(callback)

})