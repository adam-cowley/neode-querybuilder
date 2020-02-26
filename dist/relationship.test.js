"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var relationship_1 = __importDefault(require("./relationship"));
var constants_1 = require("./constants");
var property_1 = __importDefault(require("./property"));
describe('Relationship', function () {
    it('should build a relationship with a type', function () {
        var relationship = new relationship_1.default('TYPE');
        expect(relationship.toString()).toBe('-[:TYPE]-');
    });
    it('should build a relationship with a type and direction', function () {
        var relationship = new relationship_1.default('TYPE', constants_1.Direction.INCOMING);
        expect(relationship.toString()).toBe('<-[:TYPE]-');
    });
    it('should build a relationship with a type and direction', function () {
        var properties = [
            new property_1.default('key1', 'param1'),
            new property_1.default('key2', 'param2'),
        ];
        var relationship = new relationship_1.default('TYPE', constants_1.Direction.OUTGOING, null, properties);
        expect(relationship.toString()).toBe('-[:TYPE {key1: $param1, key2: $param2}]->');
    });
    it('should build a relationship with a type and direction', function () {
        var properties = [
            new property_1.default('key1', 'param1'),
            new property_1.default('key2', 'param2'),
        ];
        var relationship = new relationship_1.default('TYPE', constants_1.Direction.BOTH, 'alias', properties);
        expect(relationship.toString()).toBe('-[alias:TYPE {key1: $param1, key2: $param2}]-');
    });
    it('should build a variable length relationship as a number', function () {
        var relationship = new relationship_1.default('TYPE', constants_1.Direction.BOTH, 'alias', [], 2);
        expect(relationship.toString()).toBe('-[alias:TYPE*2]-');
    });
    it('should build a variable length relationship', function () {
        var relationship = new relationship_1.default('TYPE', constants_1.Direction.BOTH, 'alias', [], '2..3');
        expect(relationship.toString()).toBe('-[alias:TYPE*2..3]-');
    });
    it('should build a variable length relationship using setDegrees', function () {
        var rel = new relationship_1.default('TYPE');
        rel.setDegrees(3);
        expect(rel.toString()).toBe("-[:TYPE*3]-");
    });
});
