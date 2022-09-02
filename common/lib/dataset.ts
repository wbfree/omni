import { QueryResult } from './common'
import { OmniField } from './datafields'

export class OmniDataSet {
    private Record: Array<OmniField> = new Array<OmniField>();
    private Results: Array<Object>;
    private CurrentRecord: number = 0;

    constructor(json: any) {
        const queryResults: QueryResult = json

        queryResults.Metadata.Fields.forEach((json: Object) => {
            this.Record.push(OmniField.Create(json))
        })

        this.Results = queryResults.Results

        //Object.create('OmniIntegerField')
        //Object.keys(obj.Classes).forEach(key: string) => console.log(key))

        //let classes: Array<string> = (Array<string>)obj['Classes'];
        // (Array<string>)obj['Classes'].forEach
        //Object.assign(this, obj)
    }

    public GetRecord(): Array<OmniField> {
        this.Record.forEach((field: OmniField) => field.Assign(this.Results[this.CurrentRecord]))
        return this.Record
    }
    public FirstRecord(): void {
        this.CurrentRecord = 0
    }
    public NextRecord(): boolean {
        return ++this.CurrentRecord < this.Results.length
    }

}
