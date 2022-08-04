"use strict";
//import { DbDatabaseMetadata, DbTableMetadata, DbFieldMetadata } from './common.js'
let modello = {
    Classes: {
        id: 'IntegerClass',
        description: 'StringClass',
        lookup: 'LookupClass'
    },
    Results: [
        {
            id: 1,
            description: 'desc1',
            lookup: { key: 1, value: 'lookup1' }
        },
        {
            id: 2,
            description: 'desc2',
            lookup: { key: 2, value: 'lookup2' }
        }
    ]
};
class OmniField {
}
class OmniIntegerField extends OmniField {
    name() {
        return 'integer';
    }
}
class OmniStringField extends OmniField {
    name() {
        return 'string';
    }
}
let arr = new Array();
arr.push(new OmniIntegerField());
arr.push(new OmniStringField());
console.log();
//arr.forEach((element: BaseTypeClass) => console.log(element.name()));
class OmniRecord {
    constructor() {
        this.Fields = new Array;
    }
}
class OmniDataSet {
    constructor(obj) {
        this.Records = new Array;
        const { Classes, Results } = obj;
        Object.keys(Classes).forEach((key) => {
            console.log(key);
        });
        //Object.create('OmniIntegerField')
        //results.forEach()
        //Object.keys(obj.Classes).forEach(key: string) => console.log(key))
        //let classes: Array<string> = (Array<string>)obj['Classes'];
        // (Array<string>)obj['Classes'].forEach
        //Object.assign(this, obj)
    }
    Get() {
        return new Array();
    }
}
let model = new OmniDataSet(modello);
console.log(model);
