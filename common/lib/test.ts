//import { DbDatabaseMetadata, DbTableMetadata, DbFieldMetadata } from './common.js'

class TType_ {
    public field: string = '';
    public field_lookup: string | undefined;
    public type: string = '';
    public description: string | undefined;

    public constructor(ty: TType_) {
        Object.assign(this, ty)
    }

}
abstract class OmniField extends TType_ {
    public Value: any = 0

    public constructor(ty: TType_) {
        super(ty)
    }

    public static Create(json: TType_): OmniField {
        switch (json.type) {
            case 'int': return new OmniIntegerField(json)
            case 'string': return new OmniStringField(json)
            case 'lookup': return new OmniLookupField(json)
        }
        return new OmniUnknownField(json)
    }
    public Assign(obj: Object): void {
        type ObjectKey = keyof typeof obj;
        this.Value = obj[this.field as ObjectKey]
    }
    public AsString(): string {
        return this.Value
    }
}

class OmniIntegerField extends OmniField {
}
class OmniStringField extends OmniField {
}
class OmniLookupField extends OmniField {
    public Key: any = 0
    public Assign(obj: Object): void {
        type ObjectKey = keyof typeof obj;
        this.Key = obj[this.field as ObjectKey]
        this.Value = obj[this.field_lookup as ObjectKey]
    }
    public AsString(): string {
        return `${this.Key} ${this.Value}`
    }
}
class OmniUnknownField extends OmniField {
    public AsString(): string {
        return 'UNKNOWN'
    }
}





let modello = {
    Types: [
        { field: 'id', type: 'int', description: 'ID' },
        { field: 'description', type: 'string', description: 'Descrizione' },
        { field: 'idlocalita', type: 'lookup', field_lookup: 'idlocalita_lookup', description: 'Localita di nascita' }
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
            idlocalita: 2,
            idlocalita_lookup: 'loc2',
        }
    ]

}


let arr = new Array<OmniField>()
//arr.push(new OmniIntegerField(undefined))
//arr.push(new OmniStringField(undefined))

//arr.forEach((element: BaseTypeClass) => console.log(element.name()));

class OmniDataSet {
    private Record: Array<OmniField> = new Array<OmniField>();
    private Results: Array<Object>;
    private CurrentRecord: number = 0;

    constructor(json: any) {
        const { Types, Results, }: { Types: Array<TType_>, Results: Array<Object> } = json;

        Types.forEach((json: TType_) => {
            this.Record.push(OmniField.Create(json))
        })

        this.Results = Results

        //Object.create('OmniIntegerField')
        //Object.keys(obj.Classes).forEach(key: string) => console.log(key))

        //let classes: Array<string> = (Array<string>)obj['Classes'];
        // (Array<string>)obj['Classes'].forEach
        //Object.assign(this, obj)
    }

    public Get(): Array<OmniField> {
        this.Record.forEach((field: OmniField) => field.Assign(this.Results[this.CurrentRecord]))
        return this.Record
    }
    public First(): void {
        this.CurrentRecord = 0
    }
    public Next(): boolean {
        return ++this.CurrentRecord < this.Results.length
    }

}

let dataSet = new OmniDataSet(modello)

do {
    dataSet.Get().forEach((field: OmniField) => console.log(field.AsString()))
}
while (dataSet.Next())

//console.log(model)
