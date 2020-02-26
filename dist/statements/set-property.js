"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
var SetProperty = /** @class */ (function () {
    function SetProperty(key, param, operator) {
        if (operator === void 0) { operator = constants_1.SetOperator.EQUALS; }
        this.key = key;
        this.param = param;
        this.operator = operator;
    }
    SetProperty.prototype.toString = function () {
        return this.key + " " + this.operator + " $" + this.param;
    };
    return SetProperty;
}());
exports.default = SetProperty;
