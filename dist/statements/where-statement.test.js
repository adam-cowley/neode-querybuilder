"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var where_statement_1 = __importDefault(require("./where-statement"));
var constants_1 = require("../constants");
describe('WhereStatement.ts', function () {
    describe('::constructor', function () {
        test('Equals', function () {
            expect((new where_statement_1.default(constants_1.Condition.WHERE))
                .where('this', 'that')
                .toString()).toEqual('WHERE (this = $that)');
            expect((new where_statement_1.default(constants_1.Condition.WHERE))
                .where('this', 'that', constants_1.Operator.EQUALS)
                .toString()).toEqual('WHERE (this = $that)');
        });
        test('Not', function () {
            expect((new where_statement_1.default(constants_1.Condition.WHERE))
                .whereNot('this', 'that')
                .toString()).toEqual('WHERE (NOT this = $that)');
        });
        test('id(n)', function () {
            expect((new where_statement_1.default(constants_1.Condition.WHERE))
                .whereId('this', 'that')
                .toString()).toEqual('WHERE (id(this) = $that)');
        });
        test('NOT id(n)', function () {
            expect((new where_statement_1.default(constants_1.Condition.WHERE))
                .whereNotId('this', 'that')
                .toString()).toEqual('WHERE (NOT id(this) = $that)');
        });
        test('Raw Statements', function () {
            expect((new where_statement_1.default(constants_1.Condition.WHERE))
                .whereRaw('this <> that')
                .toString()).toEqual('WHERE (this <> that)');
        });
        test('AND', function () {
            expect((new where_statement_1.default(constants_1.Condition.WHERE))
                .where('this', 'that')
                .where('that', 'this')
                .toString()).toEqual('WHERE (this = $that AND that = $this)');
        });
        test('OR', function () {
            expect((new where_statement_1.default(constants_1.Condition.WHERE))
                .where('this', 'that')
                .or('that', 'this')
                .toString()).toEqual('WHERE (this = $that OR that = $this)');
        });
    });
    describe('Prefix', function () {
        expect((new where_statement_1.default(constants_1.Condition.OR))
            .where('this', 'that')
            .or('that', 'this')
            .toString()).toEqual('OR (this = $that OR that = $this)');
    });
});
