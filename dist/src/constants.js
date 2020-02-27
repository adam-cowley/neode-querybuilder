"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Condition;
(function (Condition) {
    Condition["DEFAULT"] = "";
    Condition["WHERE"] = "WHERE ";
    Condition["OR"] = "OR ";
})(Condition = exports.Condition || (exports.Condition = {}));
var Direction;
(function (Direction) {
    Direction[Direction["INCOMING"] = 0] = "INCOMING";
    Direction[Direction["OUTGOING"] = 1] = "OUTGOING";
    Direction[Direction["BOTH"] = 2] = "BOTH";
})(Direction = exports.Direction || (exports.Direction = {}));
var Operator;
(function (Operator) {
    Operator["EQUALS"] = "=";
    Operator["LIKE"] = "LIKE";
    Operator["CONTAINS"] = "CONTAINS";
    Operator["STARTS_WITH"] = "STARTS WITH";
    Operator["ENDS_WITH"] = "ENDS WITH";
    Operator["GREATER_THAN"] = ">";
    Operator["GREATER_THAN_OR_EQUAL"] = ">=";
    Operator["LESS_THAN"] = "<";
    Operator["LESS_THAN_OR_EQUAL"] = "<=";
})(Operator = exports.Operator || (exports.Operator = {}));
var Order;
(function (Order) {
    Order["ASC"] = "ASC";
    Order["DESC"] = "DESC";
})(Order = exports.Order || (exports.Order = {}));
var Prefix;
(function (Prefix) {
    Prefix["AND"] = "AND ";
    Prefix["OR"] = "OR ";
    Prefix["DEFAULT"] = "AND ";
})(Prefix = exports.Prefix || (exports.Prefix = {}));
var SetOperator;
(function (SetOperator) {
    SetOperator["EQUALS"] = "=";
    SetOperator["APPEND_EQUALS"] = "+=";
})(SetOperator = exports.SetOperator || (exports.SetOperator = {}));
var StatementPrefix;
(function (StatementPrefix) {
    StatementPrefix["MATCH"] = "MATCH";
    StatementPrefix["OPTIONAL_MATCH"] = "OPTIONAL MATCH";
    StatementPrefix["WITH"] = "WITH";
    StatementPrefix["CALL"] = "CALL";
    StatementPrefix["CREATE"] = "CREATE";
    StatementPrefix["MERGE"] = "MERGE";
    StatementPrefix["DETACH_DELETE"] = "DETACH DELETE";
})(StatementPrefix = exports.StatementPrefix || (exports.StatementPrefix = {}));
