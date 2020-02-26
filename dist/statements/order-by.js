"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OrderBy = /** @class */ (function () {
    function OrderBy(key, order) {
        this.key = key;
        this.order = order;
    }
    OrderBy.prototype.toString = function () {
        return this.key + " " + this.order;
    };
    return OrderBy;
}());
exports.default = OrderBy;
