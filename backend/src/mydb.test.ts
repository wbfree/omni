import { GetMetadata, DbDatabaseMetadata_Loader } from './mydb';
import { DbDatabaseMetadata } from 'omni_common'

test('generic test', () => {

    GetMetadata()
        .then((meta: DbDatabaseMetadata) => {
            const json_data: string = JSON.stringify(meta);
            const meta_from_json = DbDatabaseMetadata_Loader.FromJSON(json_data, new DbDatabaseMetadata)

            console.log(JSON.stringify(meta_from_json))
            //console.log(JSON.stringify(meta))
        })

    return undefined
})