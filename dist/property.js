"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var Property = /** @class */ (function () {
    function Property(key, param, operator) {
        if (operator === void 0) { operator = constants_1.Operator.EQUALS; }
        this.key = key;
        this.param = param;
        this.operator = operator;
    }
    Property.prototype.getParam = function () {
        return this.param;
    };
    Property.prototype.convertParam = function () {
        return this.param ? "$" + this.param : 'null';
    };
    Property.prototype.toInlineString = function () {
        return this.key + ": " + this.convertParam();
    };
    Property.prototype.toString = function () {
        return this.key + " " + this.operator + " " + this.convertParam();
    };
    return Property;
}());
exports.default = Property;
