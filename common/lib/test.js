"use strict";
//import { DbDatabaseMetadata, DbTableMetadata, DbFieldMetadata } from './common.js'
class OmniField {
    constructor(ty) {
        this.type = ty;
    }
}
class OmniIntegerField extends OmniField {
    value() {
        return 'integer';
    }
}
class OmniStringField extends OmniField {
    value() {
        return 'string';
    }
}
class OmniLookupField extends OmniField {
    value() {
        return 'string';
    }
}
class OmniUnknownField extends OmniField {
    value() {
        return 'unknown';
    }
}
class TType_ {
    constructor() {
        this.field = '';
        this.type = '';
    }
    Create() {
        switch (this.type) {
            case 'int': return new OmniIntegerField(this);
            case 'string': return new OmniStringField(this);
            case 'lookup': return new OmniLookupField(this);
        }
        return new OmniUnknownField(this);
    }
}
let modello = {
    Types_: [
        { field: 'id', type: 'int', description: 'ID' },
        { field: 'description', type: 'string', description: 'Descrizione' },
        { field: 'idlocalita', type: 'lookup', lookup: 'idlocalita_lookup', description: 'Localita di nascita' }
    ],
    Results: [
        {
            id: 1,
            description: 'desc1',
            idlocalita: 1,
            idlocalita_lookup: 'loc1',
        },
        {
            id: 2,
            description: 'desc2',
            idlocalita_lookup: 'loc2',
        }
    ]
};
let arr = new Array();
//arr.push(new OmniIntegerField(undefined))
//arr.push(new OmniStringField(undefined))
//arr.forEach((element: BaseTypeClass) => console.log(element.name()));
class OmniDataSet {
    constructor(obj) {
        this.Record = new Array();
        const { Types, Results, } = obj;
        Types.forEach((_type) => {
            this.Record.push(_type.Create());
        });
        this.Results = Results;
        this.Record.forEach((field) => {
            console.log(field.value);
        });
        //Object.create('OmniIntegerField')
        //Object.keys(obj.Classes).forEach(key: string) => console.log(key))
        //let classes: Array<string> = (Array<string>)obj['Classes'];
        // (Array<string>)obj['Classes'].forEach
        //Object.assign(this, obj)
    }
    GetR() {
        return new Array();
    }
}
let model = new OmniDataSet(modello);
console.log(model);
