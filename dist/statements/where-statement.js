"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var predicate_1 = __importDefault(require("../predicates/predicate"));
var where_raw_1 = __importDefault(require("../predicates/where-raw"));
var where_id_1 = __importDefault(require("../predicates/where-id"));
var constants_1 = require("../constants");
var where_between_1 = __importDefault(require("../predicates/where-between"));
var WhereStatement = /** @class */ (function () {
    function WhereStatement(condition) {
        if (condition === void 0) { condition = constants_1.Condition.DEFAULT; }
        this.predicates = [];
        this.condition = condition;
    }
    Object.defineProperty(WhereStatement.prototype, "length", {
        get: function () {
            return this.predicates.length;
        },
        enumerable: true,
        configurable: true
    });
    WhereStatement.prototype.where = function (alias, param, operator, prefix, negative) {
        if (negative === void 0) { negative = false; }
        if (alias instanceof WhereStatement) {
            this.predicates.push(alias);
        }
        else {
            var predicate = new predicate_1.default(alias, param, operator, prefix);
            if (negative)
                predicate.setNegative();
            this.predicates.push(predicate);
        }
        return this;
    };
    WhereStatement.prototype.whereNot = function (alias, param, prefix) {
        this.predicates.push(new predicate_1.default(alias, param, constants_1.Operator.EQUALS, prefix).setNegative());
        return this;
    };
    WhereStatement.prototype.whereId = function (alias, param, prefix) {
        this.predicates.push(new where_id_1.default(alias, param, constants_1.Operator.EQUALS, prefix));
        return this;
    };
    WhereStatement.prototype.whereNotId = function (alias, param, prefix) {
        this.predicates.push(new where_id_1.default(alias, param, constants_1.Operator.EQUALS, prefix).setNegative());
        return this;
    };
    WhereStatement.prototype.whereRaw = function (predicate, prefix) {
        this.predicates.push(new where_raw_1.default(predicate, prefix));
        return this;
    };
    WhereStatement.prototype.whereBetween = function (alias, floor, ceiling) {
        this.predicates.push(new where_between_1.default(alias, floor, ceiling));
        return this;
    };
    WhereStatement.prototype.whereLike = function (key, param) {
        this.predicates.push(new predicate_1.default(key, param, constants_1.Operator.LIKE));
        return this;
    };
    WhereStatement.prototype.whereNotLike = function (key, param) {
        this.predicates.push(new predicate_1.default(key, param, constants_1.Operator.LIKE).setNegative());
        return this;
    };
    WhereStatement.prototype.whereStartsWith = function (key, param) {
        this.predicates.push(new predicate_1.default(key, param, constants_1.Operator.STARTS_WITH));
        return this;
    };
    WhereStatement.prototype.whereNotStartsWith = function (key, param) {
        this.predicates.push(new predicate_1.default(key, param, constants_1.Operator.STARTS_WITH).setNegative());
        return this;
    };
    WhereStatement.prototype.whereEndsWith = function (key, param) {
        this.predicates.push(new predicate_1.default(key, param, constants_1.Operator.ENDS_WITH));
        return this;
    };
    WhereStatement.prototype.whereNotEndsWith = function (key, param) {
        this.predicates.push(new predicate_1.default(key, param, constants_1.Operator.ENDS_WITH).setNegative());
        return this;
    };
    WhereStatement.prototype.whereContains = function (key, param) {
        this.predicates.push(new predicate_1.default(key, param, constants_1.Operator.CONTAINS));
        return this;
    };
    WhereStatement.prototype.whereNotContains = function (key, param) {
        this.predicates.push(new predicate_1.default(key, param, constants_1.Operator.CONTAINS).setNegative());
        return this;
    };
    WhereStatement.prototype.whereGreaterThan = function (key, param) {
        this.predicates.push(new predicate_1.default(key, param, constants_1.Operator.GREATER_THAN));
        return this;
    };
    WhereStatement.prototype.whereGreaterThanOrEqual = function (key, param) {
        this.predicates.push(new predicate_1.default(key, param, constants_1.Operator.GREATER_THAN_OR_EQUAL));
        return this;
    };
    WhereStatement.prototype.whereLessThan = function (key, param) {
        this.predicates.push(new predicate_1.default(key, param, constants_1.Operator.LESS_THAN));
        return this;
    };
    WhereStatement.prototype.whereLessThanOrEqual = function (key, param) {
        this.predicates.push(new predicate_1.default(key, param, constants_1.Operator.LESS_THAN_OR_EQUAL));
        return this;
    };
    WhereStatement.prototype.or = function (alias, param, operator) {
        this.predicates.push(new predicate_1.default(alias, param, operator, constants_1.Prefix.OR));
        return this;
    };
    WhereStatement.prototype.toString = function () {
        return this.condition + "(" + this.predicates.map(function (predicate, index) { return predicate.toString(index > 0); }).join(' ') + ")";
    };
    return WhereStatement;
}());
exports.default = WhereStatement;
