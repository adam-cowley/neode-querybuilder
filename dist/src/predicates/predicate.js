"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
var Predicate = /** @class */ (function () {
    function Predicate(alias, param, operator, prefix) {
        if (operator === void 0) { operator = constants_1.Operator.EQUALS; }
        if (prefix === void 0) { prefix = constants_1.Prefix.DEFAULT; }
        this.negative = false;
        this.alias = alias;
        this.param = param;
        this.operator = operator;
        this.prefix = prefix;
    }
    Predicate.prototype.setNegative = function () {
        this.negative = true;
        return this;
    };
    Predicate.prototype.toString = function (prefix) {
        if (prefix === void 0) { prefix = false; }
        var negative = this.negative ? 'NOT ' : '';
        return "" + (prefix ? this.prefix : '') + negative + this.alias + " " + this.operator + " $" + this.param;
    };
    return Predicate;
}());
exports.default = Predicate;
