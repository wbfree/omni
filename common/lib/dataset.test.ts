import { OmniDataSet } from './dataset'
import { OmniField } from './datafields'

const modello = {
    "Metadata": {
        "Fields": [
            {
                "SchemaName": "ebay",
                "TableName": "_annunci",
                "Field": "idannuncio",
                "Type": "bigint(20) unsigned",
                "Null": "NO",
                "Key": "PRI",
                "Default": null,
                "Extra": "auto_increment",
                "Referenced_Schema": null,
                "Referenced_Table": null,
                "Referenced_Field": null
            },
            {
                "SchemaName": "ebay",
                "TableName": "_annunci",
                "Field": "srcid",
                "Type": "int(10) unsigned",
                "Null": "NO",
                "Key": "MUL",
                "Default": null,
                "Extra": "",
                "Referenced_Schema": null,
                "Referenced_Table": null,
                "Referenced_Field": null
            },
            {
                "SchemaName": "ebay",
                "TableName": "_annunci",
                "Field": "idmovie",
                "Type": "bigint(20) unsigned",
                "Null": "YES",
                "Key": "MUL",
                "Default": null,
                "Extra": "",
                "Referenced_Schema": "ebay",
                "Referenced_Table": "_movies",
                "Referenced_Field": "idmovie"
            },
            {
                "SchemaName": "ebay",
                "TableName": "_annunci",
                "Field": "idimage",
                "Type": "bigint(20) unsigned",
                "Null": "YES",
                "Key": "MUL",
                "Default": null,
                "Extra": "",
                "Referenced_Schema": "ebay",
                "Referenced_Table": "_images",
                "Referenced_Field": "idimage"
            },
            {
                "SchemaName": "ebay",
                "TableName": "_annunci",
                "Field": "idseller",
                "Type": "bigint(20) unsigned",
                "Null": "YES",
                "Key": "MUL",
                "Default": null,
                "Extra": "",
                "Referenced_Schema": "ebay",
                "Referenced_Table": "_seller",
                "Referenced_Field": "idseller"
            },
            {
                "SchemaName": "ebay",
                "TableName": "_annunci",
                "Field": "valuta",
                "Type": "char(3)",
                "Null": "NO",
                "Key": "",
                "Default": null,
                "Extra": ""
            },
            {
                "SchemaName": "ebay",
                "TableName": "_annunci",
                "Field": "prezzo",
                "Type": "decimal(10,2)",
                "Null": "YES",
                "Key": "",
                "Default": null,
                "Extra": ""
            },
            {
                "SchemaName": "ebay",
                "TableName": "_annunci",
                "Field": "data_inizio",
                "Type": "timestamp",
                "Null": "YES",
                "Key": "",
                "Default": null,
                "Extra": ""
            },
            {
                "SchemaName": "ebay",
                "TableName": "_annunci",
                "Field": "data_fine",
                "Type": "timestamp",
                "Null": "YES",
                "Key": "",
                "Default": null,
                "Extra": ""
            },
            {
                "SchemaName": "ebay",
                "TableName": "_annunci",
                "Field": "stato",
                "Type": "enum('venduto','disponibile','non disponibile','')",
                "Null": "NO",
                "Key": "",
                "Default": null,
                "Extra": ""
            }
        ],
        "TableName": "_annunci",
        "SchemaName": "ebay"
    },
    "Err": null,
    "Results": [
        {
            "idannuncio": 1,
            "srcid": 12014801,
            "idmovie": 1,
            "idimage": 1,
            "idseller": 1,
            "valuta": "USD",
            "prezzo": 220,
            "data_inizio": "2021-09-29T22:00:00.000Z",
            "data_fine": "2021-10-30T22:00:00.000Z",
            "stato": "venduto",
            "idmovie_lookup": 33475,
            "idimage_lookup": "https://fantautosoft.altervista.org/locandine/503174d3ce2c82f45bfb4f157aae8a34c0b666a1.jpg",
            "idseller_lookup": "emovieposter"
        },
        {
            "idannuncio": 3,
            "srcid": 7517711,
            "idmovie": 3,
            "idimage": 3,
            "idseller": 1,
            "valuta": "USD",
            "prezzo": 25,
            "data_inizio": "2021-09-29T22:00:00.000Z",
            "data_fine": "2021-10-30T22:00:00.000Z",
            "stato": "venduto",
            "idmovie_lookup": 5854,
            "idimage_lookup": "https://fantautosoft.altervista.org/locandine/c42186be2b9cab3e4d32e0bae69501d17073a44a.jpg",
            "idseller_lookup": "emovieposter"
        }
    ]
}

test('generic test', () => {

    //const arr = new Array<OmniField>();
    //arr.push(new OmniIntegerField(undefined))
    //arr.push(new OmniStringField(undefined))

    //arr.forEach((element: BaseTypeClass) => console.log(element.name()));


    let dataSet = new OmniDataSet(modello)

    do {
        //    dataSet.GetRecord()

        dataSet.GetRecord().forEach((field: OmniField) => console.log(field.Field + ": " + field.AsString()))
    }
    while (dataSet.NextRecord())

})


//console.log(model)
