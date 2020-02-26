"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var property_1 = __importDefault(require("./property"));
var constants_1 = require("./constants");
describe('Property.ts', function () {
    describe('::constructor', function () {
        it('should construct', function () {
            var key = 'key';
            var param = 'param';
            var prop = new property_1.default(key, param, constants_1.Operator.GREATER_THAN_OR_EQUAL);
            expect(prop.getParam()).toBe(param);
            expect(prop.convertParam()).toBe("$" + param);
            expect(prop.toString()).toBe(key + " >= $" + param);
        });
    });
});
