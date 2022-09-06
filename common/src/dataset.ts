import { getConfigFileParsingDiagnostics } from 'typescript';
import { QueryResult } from './common'
import { OmniField } from './datafields'

export class OmniRecordSet {
    private Fields: Array<OmniField> = new Array<OmniField>();
    public RecordNo: number = 0;

    public AddField(currentMetadata: Object): void {
        this.Fields.push(OmniField.Create(currentMetadata))
    }
    public Assign(currentResult: Object, recordNo: number): OmniRecordSet {
        this.RecordNo = recordNo
        this.Fields.forEach((field: OmniField) => field.Assign(currentResult))
        return this;
    }
    public GetFieldsCount(): number {
        return this.Fields.length;
    }
    public FieldByName(fieldName: string): OmniField | undefined {
        return this.Fields.find((field: OmniField) => field.Field == fieldName)
    }
}

export class OmniDataSet {
    private Records: OmniRecordSet = new OmniRecordSet();
    private Results: Array<Object>;

    constructor(jsonMetadata: any) {
        const queryResults: QueryResult = jsonMetadata

        queryResults.Metadata.Fields.forEach((jsonMetadata: Object) => {
            this.Records.AddField(jsonMetadata)
        })

        this.Results = queryResults.Results
    }

    public GetRecord(recNum: number = this.Records.RecordNo): OmniRecordSet | undefined {
        if (recNum >= this.Results.length) return undefined
        return this.Records.Assign(this.Results[recNum], recNum)
    }
    public FirstRecord(): OmniRecordSet | undefined {
        return this.GetRecord(this.Records.RecordNo = 0)
    }
    public NextRecord(): OmniRecordSet | undefined {
        return this.GetRecord(++this.Records.RecordNo)
    }
    public Eof(): boolean {
        return this.Records.RecordNo >= this.GetRecordCount()
    }
    public GetRecordCount(): number {
        return this.Results.length
    }
}
