"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_js_1 = require("./common.js");
class OmniField extends common_js_1.DbFieldMetadata {
    constructor(json) {
        super(json.TableName, json.SchemaName, json);
        this.Value = 0;
    }
    static Create(json) {
        var _a, _b, _c;
        if (json.Referenced_Field != null)
            return new OmniLookupField(json);
        if (((_a = json.Type) === null || _a === void 0 ? void 0 : _a.startsWith('int')) || ((_b = json.Type) === null || _b === void 0 ? void 0 : _b.startsWith('bigint')))
            return new OmniIntegerField(json);
        if ((_c = json.Type) === null || _c === void 0 ? void 0 : _c.startsWith('text'))
            return new OmniStringField(json);
        return new OmniUnknownField(json);
    }
    Assign(obj) {
        this.Value = obj[this.Field];
    }
    AsString() {
        return this.Value;
    }
}
class OmniIntegerField extends OmniField {
}
class OmniStringField extends OmniField {
}
class OmniLookupField extends OmniField {
    constructor() {
        super(...arguments);
        this.Key = 0;
    }
    Assign(obj) {
        this.Key = obj[this.Field];
        this.Value = obj[this.Field + '_lookup'];
    }
    AsString() {
        return `${this.Key} ${this.Value}`;
    }
}
class OmniUnknownField extends OmniField {
    AsString() {
        return 'UNKNOWN';
    }
}
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
};
let arr = new Array();
//arr.push(new OmniIntegerField(undefined))
//arr.push(new OmniStringField(undefined))
//arr.forEach((element: BaseTypeClass) => console.log(element.name()));
class OmniDataSet {
    constructor(json) {
        this.Record = new Array();
        this.CurrentRecord = 0;
        const queryResults = json;
        queryResults.Metadata.Fields.forEach((json) => {
            this.Record.push(OmniField.Create(json));
        });
        this.Results = queryResults.Results;
        //Object.create('OmniIntegerField')
        //Object.keys(obj.Classes).forEach(key: string) => console.log(key))
        //let classes: Array<string> = (Array<string>)obj['Classes'];
        // (Array<string>)obj['Classes'].forEach
        //Object.assign(this, obj)
    }
    GetRecord() {
        this.Record.forEach((field) => field.Assign(this.Results[this.CurrentRecord]));
        return this.Record;
    }
    FirstRecord() {
        this.CurrentRecord = 0;
    }
    NextRecord() {
        return ++this.CurrentRecord < this.Results.length;
    }
}
let dataSet = new OmniDataSet(modello);
do {
    //    dataSet.GetRecord()
    dataSet.GetRecord().forEach((field) => console.log(field.Field + ": " + field.AsString()));
} while (dataSet.NextRecord());
//console.log(model)
