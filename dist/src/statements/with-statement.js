"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WithStatement = /** @class */ (function () {
    function WithStatement(values) {
        this.values = values;
    }
    WithStatement.prototype.toString = function () {
        return this.values.join(', ');
    };
    return WithStatement;
}());
exports.default = WithStatement;
