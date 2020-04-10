"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WhereBetween = /** @class */ (function () {
    function WhereBetween(alias, floor, ceiling) {
        this.alias = alias;
        this.floor = floor;
        this.ceiling = ceiling;
    }
    WhereBetween.prototype.toString = function () {
        return this.alias + " BETWEEN $" + this.floor + " AND $" + this.ceiling;
    };
    return WhereBetween;
}());
exports.default = WhereBetween;
