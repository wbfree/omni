"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniUnknownField = exports.OmniLookupField = exports.OmniStringField = exports.OmniIntegerField = exports.OmniField = void 0;
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
exports.OmniField = OmniField;
class OmniIntegerField extends OmniField {
}
exports.OmniIntegerField = OmniIntegerField;
class OmniStringField extends OmniField {
}
exports.OmniStringField = OmniStringField;
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
exports.OmniLookupField = OmniLookupField;
class OmniUnknownField extends OmniField {
    AsString() {
        return 'UNKNOWN';
    }
}
exports.OmniUnknownField = OmniUnknownField;
