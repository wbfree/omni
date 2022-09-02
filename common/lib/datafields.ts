import { DbFieldMetadata } from './common.js'

export abstract class OmniField extends DbFieldMetadata {
    public Value: any = 0

    public constructor(json: DbFieldMetadata) {
        super(json.TableName, json.SchemaName, json)
    }

    public static Create(json: any): OmniField {
        if (json.Referenced_Field != null)
            return new OmniLookupField(json)

        if (json.Type?.startsWith('int') || json.Type?.startsWith('bigint'))
            return new OmniIntegerField(json)
        if (json.Type?.startsWith('text'))
            return new OmniStringField(json)

        return new OmniUnknownField(json)
    }
    public Assign(obj: Object): void {
        type ObjectKey = keyof typeof obj;
        this.Value = obj[this.Field as ObjectKey]
    }
    public AsString(): string {
        return this.Value
    }
}

export class OmniIntegerField extends OmniField {
}
export class OmniStringField extends OmniField {
}
export class OmniLookupField extends OmniField {
    public Key: any = 0
    public Assign(obj: Object): void {
        type ObjectKey = keyof typeof obj;
        this.Key = obj[this.Field as ObjectKey]
        this.Value = obj[this.Field + '_lookup' as ObjectKey]
    }
    public AsString(): string {
        return `${this.Key} ${this.Value}`
    }
}
export class OmniUnknownField extends OmniField {
    public AsString(): string {
        return 'UNKNOWN'
    }
}
