"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var neo4j_driver_1 = require("neo4j-driver");
var statement_1 = __importDefault(require("../statements/statement"));
var property_1 = __importDefault(require("../property"));
var where_statement_1 = __importDefault(require("../statements/where-statement"));
var constants_1 = require("../constants");
var Builder = /** @class */ (function () {
    function Builder() {
        this.params = {};
        this.statements = [];
    }
    Builder.prototype.setParam = function (key, value) {
        this.params[key] = value;
        return this;
    };
    Builder.prototype.match = function (alias, labels, properties) {
        this.addStatement(constants_1.StatementPrefix.MATCH);
        this.currentStatement().match(alias, labels, this.aliasProperties(alias, properties));
        return this;
    };
    Builder.prototype.optionalMatch = function (alias, labels, properties) {
        this.addStatement(constants_1.StatementPrefix.OPTIONAL_MATCH);
        this.currentStatement().match(alias, labels, this.aliasProperties(alias, properties));
        return this;
    };
    Builder.prototype.create = function (alias, labels, properties) {
        this.addStatement(constants_1.StatementPrefix.CREATE);
        this.currentStatement().match(alias, labels, this.aliasProperties(alias, properties));
        return this;
    };
    Builder.prototype.merge = function (alias, labels, properties) {
        this.addStatement(constants_1.StatementPrefix.MERGE);
        this.currentStatement().match(alias, labels, this.aliasProperties(alias, properties));
        return this;
    };
    Builder.prototype.relationship = function (type, direction, alias, properties, degrees) {
        var _this = this;
        var props = Object.entries(properties || {})
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            return new property_1.default(key, _this.aliasProperty(null, key, value).getParam());
        });
        this.currentStatement().relationship(type, direction, alias, props, degrees);
        return this;
    };
    Builder.prototype.to = function (alias, labels, properties) {
        var _this = this;
        var props = Object.entries(properties || {})
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            return new property_1.default(key, _this.aliasProperty(null, key, value).getParam());
        });
        this.currentStatement().match(alias, labels, props);
        return this;
    };
    Builder.prototype.onCreateSet = function (key, value) {
        this.currentStatement().onCreateSet(key, this.aliasProperty(null, key, value).getParam());
        return this;
    };
    Builder.prototype.onMatchSet = function (key, value) {
        this.currentStatement().onMatchSet(key, this.aliasProperty(null, key, value).getParam());
        return this;
    };
    Builder.prototype.set = function (key, value) {
        this.currentStatement().set(key, this.aliasProperty(null, key, value).getParam());
        return this;
    };
    Builder.prototype.remove = function () {
        var _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        (_a = this.currentStatement()).remove.apply(_a, values);
        return this;
    };
    Builder.prototype.setAppend = function (key, value) {
        this.currentStatement().setAppend(key, this.aliasProperty(null, key, value).getParam());
        return this;
    };
    Builder.prototype.where = function (key, value) {
        var _this = this;
        if (key instanceof where_statement_1.default) {
            this.currentStatement().where(key);
        }
        else if (typeof key === 'object') {
            Object.entries(key)
                .map(function (_a) {
                var key = _a[0], value = _a[1];
                _this.currentStatement().where(key, _this.aliasProperty(null, key, value).getParam());
            });
        }
        else {
            this.currentStatement().where(key, this.aliasProperty(null, key, value).getParam());
        }
        return this;
    };
    Builder.prototype.whereNot = function (key, value) {
        var _this = this;
        if (typeof key === 'object') {
            Object.entries(key)
                .map(function (_a) {
                var key = _a[0], value = _a[1];
                _this.currentStatement().whereNot(key, _this.aliasProperty(null, key, value).getParam());
            });
        }
        else {
            this.currentStatement().whereNot(key, this.aliasProperty(null, key, value).getParam());
        }
        return this;
    };
    Builder.prototype.whereId = function (alias, id) {
        this.currentStatement().whereId(alias, this.aliasProperty(alias, '_id', neo4j_driver_1.int(id)).getParam());
        return this;
    };
    Builder.prototype.whereNotId = function (alias, id) {
        this.currentStatement().whereNotId(alias, this.aliasProperty(alias, '_id', neo4j_driver_1.int(id)).getParam());
        return this;
    };
    Builder.prototype.whereRaw = function (predicate) {
        this.currentStatement().whereRaw(predicate);
        return this;
    };
    Builder.prototype.whereLike = function (key, value) {
        this.currentStatement().where(key, this.aliasProperty(null, key, value).getParam(), constants_1.Operator.LIKE, constants_1.Prefix.AND, false);
        return this;
    };
    Builder.prototype.whereNotLike = function (key, value) {
        this.currentStatement().where(key, this.aliasProperty(null, key, value).getParam(), constants_1.Operator.LIKE, constants_1.Prefix.AND, true);
        return this;
    };
    Builder.prototype.whereStartsWith = function (key, value) {
        this.currentStatement().where(key, this.aliasProperty(null, key, value).getParam(), constants_1.Operator.STARTS_WITH, constants_1.Prefix.AND, false);
        return this;
    };
    Builder.prototype.whereNotStartsWith = function (key, value) {
        this.currentStatement().where(key, this.aliasProperty(null, key, value).getParam(), constants_1.Operator.STARTS_WITH, constants_1.Prefix.AND, true);
        return this;
    };
    Builder.prototype.whereEndsWith = function (key, value) {
        this.currentStatement().where(key, this.aliasProperty(null, key, value).getParam(), constants_1.Operator.ENDS_WITH, constants_1.Prefix.AND, false);
        return this;
    };
    Builder.prototype.whereNotEndsWith = function (key, value) {
        this.currentStatement().where(key, this.aliasProperty(null, key, value).getParam(), constants_1.Operator.ENDS_WITH, constants_1.Prefix.AND, true);
        return this;
    };
    Builder.prototype.whereContains = function (key, value) {
        this.currentStatement().where(key, this.aliasProperty(null, key, value).getParam(), constants_1.Operator.CONTAINS, constants_1.Prefix.AND, false);
        return this;
    };
    Builder.prototype.whereNotContains = function (key, value) {
        this.currentStatement().where(key, this.aliasProperty(null, key, value).getParam(), constants_1.Operator.CONTAINS, constants_1.Prefix.AND, true);
        return this;
    };
    Builder.prototype.whereGreaterThan = function (key, value) {
        this.currentStatement().where(key, this.aliasProperty(null, key, value).getParam(), constants_1.Operator.GREATER_THAN, constants_1.Prefix.AND, false);
        return this;
    };
    Builder.prototype.whereGreaterThanOrEqual = function (key, value) {
        this.currentStatement().where(key, this.aliasProperty(null, key, value).getParam(), constants_1.Operator.GREATER_THAN_OR_EQUAL, constants_1.Prefix.AND, false);
        return this;
    };
    Builder.prototype.whereLessThan = function (key, value) {
        this.currentStatement().where(key, this.aliasProperty(null, key, value).getParam(), constants_1.Operator.LESS_THAN, constants_1.Prefix.AND, false);
        return this;
    };
    Builder.prototype.whereLessThanOrEqual = function (key, value) {
        this.currentStatement().where(key, this.aliasProperty(null, key, value).getParam(), constants_1.Operator.LESS_THAN_OR_EQUAL, constants_1.Prefix.AND, false);
        return this;
    };
    Builder.prototype.whereBetween = function (key, floor, ceiling) {
        this.currentStatement().whereBetween(key, this.aliasProperty(null, key, floor).getParam(), this.aliasProperty(null, key, ceiling).getParam());
        return this;
    };
    Builder.prototype.delete = function () {
        var _a;
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        (_a = this.currentStatement()).delete.apply(_a, items);
        return this;
    };
    Builder.prototype.detachDelete = function () {
        var _a;
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        (_a = this.currentStatement()).detachDelete.apply(_a, items);
        return this;
    };
    Builder.prototype.orderBy = function (key, order) {
        if (order === void 0) { order = constants_1.Order.ASC; }
        this.currentStatement().orderBy(key, order);
        return this;
    };
    Builder.prototype.or = function (key, value) {
        this.addWhereStatement(constants_1.Condition.OR);
        this.where(key, value);
        return this;
    };
    Builder.prototype.skip = function (skip) {
        this.currentStatement().skip(skip);
        return this;
    };
    Builder.prototype.limit = function (limit) {
        this.currentStatement().limit(limit);
        return this;
    };
    Builder.prototype.return = function () {
        var _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        (_a = this.currentStatement()).return.apply(_a, values);
        return this;
    };
    Builder.prototype.with = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        this.addStatement(constants_1.StatementPrefix.WITH);
        this.currentStatement().with(items);
        return this;
    };
    Builder.prototype.getParams = function () {
        return this.params;
    };
    Builder.prototype.build = function () {
        return {
            cypher: this.toString(),
            params: this.params,
        };
    };
    Builder.prototype.toString = function () {
        return this.statements.map(function (statement) { return statement.toString(); })
            .join('\n');
    };
    Builder.prototype.aliasProperty = function (alias, key, value) {
        // Create a safe param name
        var param = [alias, key].filter(function (e) { return !!e; }).join('_')
            .replace(/[^a-z0-9_]+/i, '_');
        // Increment param if it already exists
        if (this.params.hasOwnProperty(param)) {
            var originalParam = param;
            var key_1 = 1;
            while (this.params.hasOwnProperty(param)) {
                key_1++;
                param = originalParam + key_1;
            }
        }
        // Convert it to an int?
        if (Number.isInteger(value))
            value = neo4j_driver_1.int(value);
        // Set in params
        this.params[param] = value;
        return new property_1.default(key, param);
    };
    Builder.prototype.currentStatement = function () {
        return this.statements[this.statements.length - 1];
    };
    Builder.prototype.aliasProperties = function (alias, properties) {
        var _this = this;
        return Object.entries(properties || {}).map(function (_a) {
            var key = _a[0], value = _a[1];
            return _this.aliasProperty(alias, key, value);
        });
    };
    Builder.prototype.addStatement = function (prefix) {
        if (prefix === void 0) { prefix = constants_1.StatementPrefix.MATCH; }
        this.statements.push(new statement_1.default(prefix));
    };
    Builder.prototype.addWhereStatement = function (condition) {
        if (condition === void 0) { condition = constants_1.Condition.WHERE; }
        this.currentStatement().predicates.push(new where_statement_1.default(condition));
    };
    return Builder;
}());
exports.default = Builder;
