//import { DbDatabaseMetadata, DbTableMetadata, DbFieldMetadata } from './common.js'


abstract class OmniField {

    public abstract name(): string;
}

class OmniIntegerField extends OmniField {

    public name(): string {
        return 'integer'
    }
}
class OmniStringField extends OmniField {

    public name(): string {
        return 'string'
    }
}


let modello = {
    Classes: {
        id: OmniStringField,
        description: OmniStringField,
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

}


let arr = new Array<OmniField>()
arr.push(new OmniIntegerField())
arr.push(new OmniStringField())

//arr.forEach((element: BaseTypeClass) => console.log(element.name()));

class OmniRecord {
    public Fields: Array<OmniField> = new Array<OmniField>

}

class OmniDataSet {
    public Records: Array<OmniRecord> = new Array<OmniRecord>;

    constructor(obj: any) {
        const { Classes, Results }: { Classes: Object, Results: Array<Object> } = obj;
        console.log(JSON.stringify(Classes))

        Object.keys(Classes).forEach((key: string) => {
            console.log(key)
        })


        //Object.create('OmniIntegerField')

        //results.forEach()

        //Object.keys(obj.Classes).forEach(key: string) => console.log(key))

        //let classes: Array<string> = (Array<string>)obj['Classes'];

        // (Array<string>)obj['Classes'].forEach

        //Object.assign(this, obj)
    }

    public Get(): Array<OmniField> {
        return new Array<OmniField>()

    }

}

let model = new OmniDataSet(modello)
console.log(model)
