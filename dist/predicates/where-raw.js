"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
var WhereRaw = /** @class */ (function () {
    function WhereRaw(predicate, prefix) {
        if (prefix === void 0) { prefix = constants_1.Prefix.DEFAULT; }
        this.predicate = predicate;
        this.prefix = prefix;
    }
    WhereRaw.prototype.toString = function (prefix) {
        if (prefix === void 0) { prefix = false; }
        return "" + (prefix ? this.prefix : '') + this.predicate;
    };
    return WhereRaw;
}());
exports.default = WhereRaw;
