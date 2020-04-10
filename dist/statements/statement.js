"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var match_statement_1 = __importDefault(require("./match-statement"));
var where_statement_1 = __importDefault(require("./where-statement"));
var constants_1 = require("../constants");
var with_statement_1 = __importDefault(require("./with-statement"));
var order_by_1 = __importDefault(require("./order-by"));
var relationship_1 = __importDefault(require("../relationship"));
var set_property_1 = __importDefault(require("./set-property"));
var call_statement_1 = __importDefault(require("./call-statement"));
var Statement = /** @class */ (function () {
    function Statement(prefix) {
        this.deleteValues = [];
        this.detachDeleteValues = [];
        this.removeValues = [];
        this.onCreateSetValues = [];
        this.onMatchSetValues = [];
        this.setValues = [];
        this.returnValues = [];
        this.yieldValues = [];
        // TODO: replace any
        this.pattern = [];
        this.predicates = [new where_statement_1.default(constants_1.Condition.WHERE)];
        this.order = [];
        this.prefix = prefix;
    }
    Statement.prototype.lastPredicate = function () {
        return this.predicates[this.predicates.length - 1];
    };
    Statement.prototype.call = function (fn) {
        var parameters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parameters[_i - 1] = arguments[_i];
        }
        this.pattern.push(new call_statement_1.default(fn, parameters));
        return this;
    };
    Statement.prototype.yield = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        this.yieldValues = this.yieldValues.concat(items);
        return this;
    };
    Statement.prototype.with = function (items) {
        this.pattern.push(new with_statement_1.default(items));
        return this;
    };
    Statement.prototype.match = function (alias, labels, properties) {
        this.pattern.push(new match_statement_1.default(alias, labels, properties));
        return this;
    };
    Statement.prototype.relationship = function (type, direction, alias, properties, degrees) {
        this.pattern.push(new relationship_1.default(type, direction, alias, properties, degrees));
        return this;
    };
    Statement.prototype.where = function (alias, param, operator, prefix, negative) {
        if (negative === void 0) { negative = false; }
        this.lastPredicate().where(alias, param, operator, prefix, negative);
        return this;
    };
    Statement.prototype.delete = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        this.deleteValues = this.deleteValues.concat(values);
        return this;
    };
    Statement.prototype.remove = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        this.removeValues = this.removeValues.concat(values);
        return this;
    };
    Statement.prototype.onCreateSet = function (key, param) {
        this.onCreateSetValues.push(new set_property_1.default(key, param));
        return this;
    };
    Statement.prototype.onMatchSet = function (key, param) {
        this.onMatchSetValues.push(new set_property_1.default(key, param));
        return this;
    };
    Statement.prototype.set = function (key, param) {
        this.setValues.push(new set_property_1.default(key, param));
        return this;
    };
    Statement.prototype.setAppend = function (key, param) {
        this.setValues.push(new set_property_1.default(key, param, constants_1.SetOperator.APPEND_EQUALS));
        return this;
    };
    Statement.prototype.detachDelete = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        this.detachDeleteValues = this.detachDeleteValues.concat(values);
        return this;
    };
    Statement.prototype.whereNot = function (alias, param, prefix) {
        this.lastPredicate().whereNot(alias, param, prefix);
        return this;
    };
    Statement.prototype.whereId = function (alias, param, prefix) {
        this.lastPredicate().whereId(alias, param, prefix);
        return this;
    };
    Statement.prototype.whereNotId = function (alias, param, prefix) {
        this.lastPredicate().whereNotId(alias, param, prefix);
        return this;
    };
    Statement.prototype.whereRaw = function (predicate, prefix) {
        this.lastPredicate().whereRaw(predicate, prefix);
        return this;
    };
    Statement.prototype.whereBetween = function (key, floor, ceiling) {
        this.lastPredicate().whereBetween(key, floor, ceiling);
        return this;
    };
    Statement.prototype.whereLike = function (key, param) {
        this.lastPredicate().whereLike(key, param);
        return this;
    };
    Statement.prototype.whereNotLike = function (key, param) {
        this.lastPredicate().whereNotLike(key, param);
        return this;
    };
    Statement.prototype.whereStartsWith = function (key, param) {
        this.lastPredicate().whereStartsWith(key, param);
        return this;
    };
    Statement.prototype.whereNotStartsWith = function (key, param) {
        this.lastPredicate().whereNotStartsWith(key, param);
        return this;
    };
    Statement.prototype.whereEndsWith = function (key, param) {
        this.lastPredicate().whereEndsWith(key, param);
        return this;
    };
    Statement.prototype.whereNotEndsWith = function (key, param) {
        this.lastPredicate().whereNotEndsWith(key, param);
        return this;
    };
    Statement.prototype.whereContains = function (key, param) {
        this.lastPredicate().whereContains(key, param);
        return this;
    };
    Statement.prototype.whereNotContains = function (key, param) {
        this.lastPredicate().whereNotContains(key, param);
        return this;
    };
    Statement.prototype.whereGreaterThan = function (key, param) {
        this.lastPredicate().whereGreaterThan(key, param);
        return this;
    };
    Statement.prototype.whereGreaterThanOrEqual = function (key, param) {
        this.lastPredicate().whereGreaterThanOrEqual(key, param);
        return this;
    };
    Statement.prototype.whereLessThan = function (key, param) {
        this.lastPredicate().whereLessThan(key, param);
        return this;
    };
    Statement.prototype.whereLessThanOrEqual = function (key, param) {
        this.lastPredicate().whereLessThanOrEqual(key, param);
        return this;
    };
    Statement.prototype.orderBy = function (key, order) {
        if (order === void 0) { order = constants_1.Order.ASC; }
        this.order.push(new order_by_1.default(key, order));
        return this;
    };
    Statement.prototype.return = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        this.returnValues = this.returnValues.concat(values);
        return this;
    };
    Statement.prototype.skip = function (amount) {
        this.skipRows = amount;
    };
    Statement.prototype.limit = function (amount) {
        this.limitRows = amount;
    };
    Statement.prototype.toString = function () {
        var output = [];
        // Original Pattern
        if (this.pattern.length) {
            output.push(this.prefix + " " + this.pattern.map(function (value) { return value.toString(); }).join(''));
        }
        // Yield?
        if (this.yieldValues.length) {
            output.push("YIELD " + this.yieldValues.map(function (value) { return value.toString(); }).join(', '));
        }
        // Where clauses
        if (this.predicates.length) {
            var where = this.predicates
                .filter(function (predicate) { return predicate.length > 0; })
                .map(function (predicate) { return predicate.toString(); })
                .join("\n");
            if (where !== '') {
                output.push(where);
            }
        }
        // Remove Values
        if (this.removeValues.length) {
            output.push("REMOVE " + this.removeValues.map(function (value) { return value.toString(); }).join(', '));
        }
        // On Create Set
        if (this.onCreateSetValues.length) {
            output.push("ON CREATE SET " + this.onCreateSetValues.map(function (value) { return value.toString(); }).join(', '));
        }
        // On Match Set
        if (this.onMatchSetValues.length) {
            output.push("ON MATCH SET " + this.onMatchSetValues.map(function (value) { return value.toString(); }).join(', '));
        }
        // Set
        if (this.setValues.length) {
            output.push("SET " + this.setValues.map(function (value) { return value.toString(); }).join(', '));
        }
        // Delete
        if (this.deleteValues.length) {
            output.push("DELETE " + this.deleteValues.map(function (value) { return value.toString(); }).join(', '));
        }
        // Detach Delete
        if (this.detachDeleteValues.length) {
            output.push("DETACH DELETE " + this.detachDeleteValues.map(function (value) { return value.toString(); }).join(', '));
        }
        // Return Statement
        if (this.returnValues.length) {
            output.push("RETURN " + this.returnValues.join(', '));
        }
        // Order
        if (this.order.length) {
            output.push("ORDER BY " + this.order.map(function (order) { return order.toString(); }).join(', '));
        }
        // Skip
        if (this.skipRows !== undefined) {
            output.push("SKIP " + this.skipRows);
        }
        // Limit
        if (this.limitRows !== undefined) {
            output.push("LIMIT " + this.limitRows);
        }
        return output.join('\n');
    };
    return Statement;
}());
exports.default = Statement;
