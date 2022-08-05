//import { DbDatabaseMetadata, DbTableMetadata, DbFieldMetadata } from './common.js'


class TType_ {
    public field: string | undefined;
    public type: string | undefined;
    public description: string | undefined;
    public lookup: string | undefined;
}


abstract class OmniField {
    public abstract value(): string;
    public type: TType_;

    public constructor(ty: TType_) {
        this.type = ty
    }
}

class OmniIntegerField extends OmniField {

    public value(): string {
        return 'integer'
    }
}
class OmniStringField extends OmniField {

    public value(): string {
        return 'string'
    }
}
class OmniLookupField extends OmniField {

    public value(): string {
        return 'string'
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

}


let arr = new Array<OmniField>()
//arr.push(new OmniIntegerField(undefined))
//arr.push(new OmniStringField(undefined))

//arr.forEach((element: BaseTypeClass) => console.log(element.name()));

const FieldFactory = {
    'int': OmniIntegerField,
    'string': OmniStringField,
    'lookup': OmniLookupField
}

class OmniDataSet {
    public Record: Array<OmniField> = new Array<OmniField>;
    public Results: Array<Object>;

    constructor(obj: any) {
        const { Types, Results, }: { Types: Array<TType_>, Results: Array<Object> } = obj;

        Types.forEach((_type: TType_) => {
            this.Record.push(new FieldFactory[str](Types))
        })
        for (const { Types } of obj) {
            this.Record.push(new FieldFactory['int'](Types))
        }
        this.Results = Results

        this.Record.forEach((field: OmniField) => {
            console.log(field.value)
        })

        //Object.create('OmniIntegerField')
        //Object.keys(obj.Classes).forEach(key: string) => console.log(key))

        //let classes: Array<string> = (Array<string>)obj['Classes'];
        // (Array<string>)obj['Classes'].forEach
        //Object.assign(this, obj)
    }

    public GetR(): Array<OmniField> {
        return new Array<OmniField>()
    }

}

let model = new OmniDataSet(modello)
console.log(model)
