"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CallStatement = /** @class */ (function () {
    function CallStatement(fn, parameters) {
        this.fn = fn;
        this.parameters = parameters;
    }
    CallStatement.prototype.parameterToString = function (param) {
        var _this = this;
        if (typeof param === 'string' && param.substr(0, 1) != '$') {
            return "\"" + param.replace('"', '\"') + "\"";
        }
        else if (Array.isArray(param)) {
            // TODO: Always a comma?
            return "[" + param.map(function (p) { return _this.parameterToString(p); }).join(', ') + "]";
        }
        else if (typeof param === 'object') {
            var output = '{';
            output += Object.entries(param)
                .map(function (_a) {
                var key = _a[0], value = _a[1];
                return key + ": " + _this.parameterToString(value);
            })
                .join(', ');
            return output + "}";
        }
        return param.toString();
    };
    CallStatement.prototype.toString = function () {
        var _this = this;
        return this.fn + "(" + this.parameters.map(function (param) { return _this.parameterToString(param); }).join(', ') + ")";
    };
    return CallStatement;
}());
exports.default = CallStatement;
