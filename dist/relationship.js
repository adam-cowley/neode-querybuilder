"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var Relationship = /** @class */ (function () {
    function Relationship(type, direction, alias, properties, degrees) {
        if (direction === void 0) { direction = constants_1.Direction.BOTH; }
        if (alias === void 0) { alias = undefined; }
        if (properties === void 0) { properties = []; }
        if (degrees === void 0) { degrees = undefined; }
        this.properties = [];
        this.type = type;
        this.direction = direction;
        this.alias = alias;
        this.properties = properties;
        this.degrees = degrees;
    }
    Relationship.prototype.setDegrees = function (degrees) {
        this.degrees = degrees;
        return this;
    };
    Relationship.prototype.toString = function () {
        var type = '';
        if (Array.isArray(this.type)) {
            type = this.type.join('|');
        }
        else if (this.type !== undefined) {
            type = this.type;
        }
        return [
            this.direction === constants_1.Direction.INCOMING ? '<' : '',
            '-[',
            this.alias !== undefined ? this.alias : '',
            ':',
            type,
            this.properties.length ? " {" + this.properties.map(function (property) { return property.toInlineString(); }).join(', ') + "}" : '',
            this.degrees !== undefined ? "*" + this.degrees : '',
            ']-',
            this.direction === constants_1.Direction.OUTGOING ? '>' : '',
        ].join('');
    };
    return Relationship;
}());
exports.default = Relationship;
