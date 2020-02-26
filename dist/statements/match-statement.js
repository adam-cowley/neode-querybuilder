"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MatchStatement = /** @class */ (function () {
    function MatchStatement(alias, model, properties) {
        this.alias = alias;
        this.model = model;
        this.properties = properties;
    }
    MatchStatement.prototype.toString = function () {
        var output = "(" + (this.alias || '');
        if (Array.isArray(this.model)) {
            output += ":" + this.model.join(':');
        }
        else if (this.model !== undefined) {
            output += ":" + this.model;
        }
        if (this.properties !== undefined && this.properties.length) {
            output += " {";
            output += this.properties.map(function (prop) { return prop.toInlineString(); }).join(', ');
            output += "}";
        }
        return output + ')';
    };
    return MatchStatement;
}());
exports.default = MatchStatement;
