"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniDataSet = void 0;
const datafields_1 = require("./datafields");
class OmniDataSet {
    constructor(json) {
        this.Record = new Array();
        this.CurrentRecord = 0;
        const queryResults = json;
        queryResults.Metadata.Fields.forEach((json) => {
            this.Record.push(datafields_1.OmniField.Create(json));
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
exports.OmniDataSet = OmniDataSet;
