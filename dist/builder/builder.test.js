"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = __importDefault(require(".."));
var neo4j_driver_1 = require("neo4j-driver");
var where_statement_1 = __importDefault(require("../statements/where-statement"));
var constants_1 = require("../constants");
describe('Builder', function () {
    describe('::constructor', function () {
        test('Should construct', function () {
            var builder = new __1.default();
            expect(builder).toBeInstanceOf(__1.default);
        });
    });
    describe('MATCH', function () {
        test('should return itself', function () {
            var builder = new __1.default();
            var match = builder.match('a');
            expect(match).toEqual(builder);
        });
        test('should make a match with only an alias', function () {
            var builder = new __1.default();
            var cypher = builder.match('n')
                .return('n')
                .toString();
            expect(cypher).toBe("MATCH (n)\nRETURN n");
        });
        test('should make a query with a single label', function () {
            var builder = new __1.default();
            var cypher = builder.match('n', 'Node')
                .return('n')
                .toString();
            expect(cypher).toBe("MATCH (n:Node)\nRETURN n");
        });
        test('should make a query with an array of labels', function () {
            var builder = new __1.default();
            var cypher = builder.match('n', ['Node', 'Entity'])
                .return('n')
                .toString();
            expect(cypher).toBe("MATCH (n:Node:Entity)\nRETURN n");
        });
        test('should make a query with a single label and properties', function () {
            var builder = new __1.default();
            var cypher = builder.match('n', 'Node', { id: 1, active: true })
                .return('n')
                .toString();
            expect(cypher).toBe("MATCH (n:Node {id: $n_id, active: $n_active})\nRETURN n");
        });
        describe('::whereNot', function () {
            test('should accept a string and value', function () {
                var builder = new __1.default();
                var _a = builder
                    .match('this', 'Node')
                    .whereNot('this.id', 1)
                    .return('this')
                    .build(), cypher = _a.cypher, params = _a.params;
                expect(cypher).toBe("MATCH (this:Node)\nWHERE (NOT this.id = $this_id)\nRETURN this");
                expect(params).toEqual({ this_id: neo4j_driver_1.int(1) });
            });
            test('should accept an object', function () {
                var builder = new __1.default();
                var _a = builder
                    .match('this', 'Node')
                    .whereNot({ 'this.id': 1 })
                    .return('this')
                    .build(), cypher = _a.cypher, params = _a.params;
                expect(cypher).toBe("MATCH (this:Node)\nWHERE (NOT this.id = $this_id)\nRETURN this");
                expect(params).toEqual({ this_id: neo4j_driver_1.int(1) });
            });
            test('should accept an object with more than one item', function () {
                var builder = new __1.default();
                var _a = builder
                    .match('this', 'Node')
                    .whereNot({ 'this.id': 1, 'this.name': 'name' })
                    .return('this')
                    .build(), cypher = _a.cypher, params = _a.params;
                expect(cypher).toBe("MATCH (this:Node)\nWHERE (NOT this.id = $this_id AND NOT this.name = $this_name)\nRETURN this");
                expect(params).toEqual({ this_id: neo4j_driver_1.int(1), this_name: 'name' });
            });
        });
        describe('::whereId', function () {
            test('should build a match query on an internal ID', function () {
                var builder = new __1.default();
                var cypher = builder.match('n', 'Node')
                    .whereId('n', 1)
                    .return('n')
                    .toString();
                expect(cypher).toBe("MATCH (n:Node)\nWHERE (id(n) = $n__id)\nRETURN n");
                expect(builder.getParams()).toEqual({ n__id: neo4j_driver_1.int(1) });
            });
            test('should build multiple MATCH statements', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('this', 'Node').whereId('this', 1)
                    .match('that', 'Node').whereId('that', 2)
                    .return('this', 'that')
                    .toString();
                expect(cypher).toBe([
                    "MATCH (this:Node)\nWHERE (id(this) = $this__id)",
                    "MATCH (that:Node)\nWHERE (id(that) = $that__id)",
                    "RETURN this, that"
                ].join('\n'));
                expect(builder.getParams()).toEqual({ this__id: neo4j_driver_1.int(1), that__id: neo4j_driver_1.int(2) });
            });
        });
        describe('::whereNotId', function () {
            test('should build a match query on an internal ID', function () {
                var builder = new __1.default();
                var cypher = builder.match('n', 'Node')
                    .whereNotId('n', 1)
                    .return('n')
                    .toString();
                expect(cypher).toBe("MATCH (n:Node)\nWHERE (NOT id(n) = $n__id)\nRETURN n");
                expect(builder.getParams()).toEqual({ n__id: neo4j_driver_1.int(1) });
            });
        });
        describe('::whereRaw', function () {
            test('should mix raw predicates with regular ones', function () {
                var builder = new __1.default();
                var _a = builder
                    .match('this', 'Node')
                    .where({ 'this.id': 1 })
                    .whereRaw("this.name STARTS WITH 'n'")
                    .return('this')
                    .build(), cypher = _a.cypher, params = _a.params;
                expect(cypher).toBe("MATCH (this:Node)\nWHERE (this.id = $this_id AND this.name STARTS WITH 'n')\nRETURN this");
                expect(params).toEqual({ this_id: neo4j_driver_1.int(1) });
            });
        });
        describe('::whereLike', function () {
            it('should build a like clause', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('n')
                    .whereLike('n.prop', 'value')
                    .return('n')
                    .toString();
                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (n.prop LIKE $n_prop)',
                    'RETURN n'
                ].join('\n'));
            });
        });
        describe('::whereNotLike', function () {
            it('should build a not like clause', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('n')
                    .whereNotLike('n.prop', 'value')
                    .return('n')
                    .toString();
                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (NOT n.prop LIKE $n_prop)',
                    'RETURN n'
                ].join('\n'));
            });
        });
        describe('::whereStartsWith', function () {
            it('should build a starts with clause', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('n')
                    .whereStartsWith('n.prop', 'value')
                    .return('n')
                    .toString();
                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (n.prop STARTS WITH $n_prop)',
                    'RETURN n'
                ].join('\n'));
            });
        });
        describe('::whereNotStartsWith', function () {
            it('should build a negative starts with clause', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('n')
                    .whereNotStartsWith('n.prop', 'value')
                    .return('n')
                    .toString();
                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (NOT n.prop STARTS WITH $n_prop)',
                    'RETURN n'
                ].join('\n'));
            });
        });
        describe('::whereEndsWith', function () {
            it('should build a Ends with clause', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('n')
                    .whereEndsWith('n.prop', 'value')
                    .return('n')
                    .toString();
                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (n.prop ENDS WITH $n_prop)',
                    'RETURN n'
                ].join('\n'));
            });
        });
        describe('::whereNotEndsWith', function () {
            it('should build a negative Ends with clause', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('n')
                    .whereNotEndsWith('n.prop', 'value')
                    .return('n')
                    .toString();
                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (NOT n.prop ENDS WITH $n_prop)',
                    'RETURN n'
                ].join('\n'));
            });
        });
        describe('::whereContains', function () {
            it('should build a Contains clause', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('n')
                    .whereContains('n.prop', 'value')
                    .return('n')
                    .toString();
                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (n.prop CONTAINS $n_prop)',
                    'RETURN n'
                ].join('\n'));
            });
        });
        describe('::whereNotContains', function () {
            it('should build a Contains clause', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('n')
                    .whereNotContains('n.prop', 'value')
                    .return('n')
                    .toString();
                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (NOT n.prop CONTAINS $n_prop)',
                    'RETURN n'
                ].join('\n'));
            });
        });
        describe('::greaterThan', function () {
            it('should build a Greater Than clause', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('n')
                    .whereGreaterThan('n.prop', 'value')
                    .return('n')
                    .toString();
                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (n.prop > $n_prop)',
                    'RETURN n'
                ].join('\n'));
            });
        });
        describe('::greaterThanOrEqual', function () {
            it('should build a Greater Than or equal clause', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('n')
                    .whereGreaterThanOrEqual('n.prop', 'value')
                    .return('n')
                    .toString();
                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (n.prop >= $n_prop)',
                    'RETURN n'
                ].join('\n'));
            });
        });
        describe('::lessThan', function () {
            it('should build a Less Than clause', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('n')
                    .whereLessThan('n.prop', 'value')
                    .return('n')
                    .toString();
                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (n.prop < $n_prop)',
                    'RETURN n'
                ].join('\n'));
            });
        });
        describe('::lessThanOrEqual', function () {
            it('should build a Less Than or equal clause', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('n')
                    .whereLessThanOrEqual('n.prop', 'value')
                    .return('n')
                    .toString();
                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (n.prop <= $n_prop)',
                    'RETURN n'
                ].join('\n'));
            });
        });
        describe('::between', function () {
            it('should build a between clause', function () {
                var builder = new __1.default();
                var _a = builder
                    .match('n')
                    .whereBetween('n.prop', 1, 10)
                    .return('n')
                    .build(), cypher = _a.cypher, params = _a.params;
                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (n.prop BETWEEN $n_prop AND $n_prop2)',
                    'RETURN n'
                ].join('\n'));
                expect(params).toEqual({
                    n_prop: neo4j_driver_1.int(1),
                    n_prop2: neo4j_driver_1.int(10),
                });
            });
        });
        describe('::or', function () {
            test('should build an `or` query', function () {
                var builder = new __1.default();
                var _a = builder
                    .match('this', 'Node')
                    .where('this.property', 'that')
                    .or('this.other_property', 'not that')
                    .return('this')
                    .build(), cypher = _a.cypher, params = _a.params;
                expect(cypher).toBe([
                    "MATCH (this:Node)",
                    "WHERE (this.property = $this_property)",
                    "OR (this.other_property = $this_other_property)",
                    "RETURN this"
                ].join('\n'));
                expect(params).toEqual({
                    this_property: 'that',
                    this_other_property: 'not that'
                });
            });
            test('should accept an object in `.or()`', function () {
                var builder = new __1.default();
                var _a = builder
                    .match('this', 'Node')
                    .where('this.property', 'that')
                    .or({
                    'this.other_property': 'other',
                    'this.foo_property': 'bar',
                })
                    .return('this')
                    .build(), cypher = _a.cypher, params = _a.params;
                expect(cypher).toBe([
                    "MATCH (this:Node)",
                    "WHERE (this.property = $this_property)",
                    "OR (this.other_property = $this_other_property AND this.foo_property = $this_foo_property)",
                    "RETURN this"
                ].join('\n'));
                expect(params).toEqual({
                    this_property: 'that',
                    this_other_property: 'other',
                    this_foo_property: 'bar',
                });
            });
            test('should increment param if one already exists', function () {
                var builder = new __1.default();
                var _a = builder
                    .match('this', 'Node')
                    .where('this.id', 1)
                    .or('this.id', 2)
                    .return('this')
                    .build(), cypher = _a.cypher, params = _a.params;
                expect(params).toEqual({
                    this_id: neo4j_driver_1.int(1),
                    this_id2: neo4j_driver_1.int(2),
                });
            });
        });
        describe('::skip', function () {
            test('should handle a skip', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('this', 'Node')
                    .return('this')
                    .skip(10)
                    .build().cypher;
                expect(cypher).toBe([
                    "MATCH (this:Node)",
                    "RETURN this",
                    "SKIP 10",
                ].join('\n'));
            });
        });
        describe('::limit', function () {
            test('should handle a skip and limit', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('this', 'Node')
                    .return('this')
                    .skip(10)
                    .limit(10)
                    .build().cypher;
                expect(cypher).toBe([
                    "MATCH (this:Node)",
                    "RETURN this",
                    "SKIP 10",
                    "LIMIT 10",
                ].join('\n'));
            });
        });
        describe('::with', function () {
            test('should apply a with statement', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('this', 'Node')
                    .with('this')
                    .where('this.id', 1)
                    .return('this')
                    .skip(10)
                    .limit(10)
                    .build().cypher;
                expect(cypher).toBe([
                    "MATCH (this:Node)",
                    "WITH this",
                    "WHERE (this.id = $this_id)",
                    "RETURN this",
                    "SKIP 10",
                    "LIMIT 10",
                ].join('\n'));
            });
        });
        describe('::orderBy', function () {
            test('should be ascending order by default', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('this', 'Node')
                    .return('this')
                    .orderBy('this.id')
                    .build().cypher;
                expect(cypher).toBe([
                    "MATCH (this:Node)",
                    "RETURN this",
                    "ORDER BY this.id ASC",
                ].join('\n'));
            });
            test('should sort in ascending order', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('this', 'Node')
                    .return('this')
                    .orderBy('this.id', constants_1.Order.ASC)
                    .build().cypher;
                expect(cypher).toBe([
                    "MATCH (this:Node)",
                    "RETURN this",
                    "ORDER BY this.id ASC",
                ].join('\n'));
            });
            test('should sort in descending order', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('this', 'Node')
                    .return('this')
                    .orderBy('this.id', constants_1.Order.DESC)
                    .build().cypher;
                expect(cypher).toBe([
                    "MATCH (this:Node)",
                    "RETURN this",
                    "ORDER BY this.id DESC",
                ].join('\n'));
            });
            test('should accept multiple order statements', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('this', 'Node')
                    .return('this')
                    .orderBy('this.id', constants_1.Order.DESC)
                    .orderBy('this.name', constants_1.Order.ASC)
                    .build().cypher;
                expect(cypher).toBe([
                    "MATCH (this:Node)",
                    "RETURN this",
                    "ORDER BY this.id DESC, this.name ASC",
                ].join('\n'));
            });
            test('TODO: should build a query with an array of string order statements', function () { });
            test('TODO: should build a query with an order object', function () { });
            test('TODO: should build a query with an array of order object', function () { });
        });
        describe('::relationship', function () {
            test('should build a pattern without a direction', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('this', 'Node')
                    .relationship('REL')
                    .to()
                    .return('this')
                    .orderBy('this.id', constants_1.Order.DESC)
                    .orderBy('this.name', constants_1.Order.ASC)
                    .build().cypher;
                expect(cypher).toBe([
                    "MATCH (this:Node)-[:REL]-()",
                    "RETURN this",
                    "ORDER BY this.id DESC, this.name ASC",
                ].join('\n'));
            });
            test('should build a pattern with an outgoing direction', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('this', 'Node')
                    .relationship('REL', constants_1.Direction.OUTGOING)
                    .to()
                    .return('this')
                    .build().cypher;
                expect(cypher).toBe([
                    "MATCH (this:Node)-[:REL]->()",
                    "RETURN this",
                ].join('\n'));
            });
            test('should build a pattern with an incoming direction', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('this', 'Node')
                    .relationship('REL', constants_1.Direction.INCOMING)
                    .to('that')
                    .return('this')
                    .build().cypher;
                expect(cypher).toBe([
                    "MATCH (this:Node)<-[:REL]-(that)",
                    "RETURN this",
                ].join('\n'));
            });
            test('should build a pattern with both directions', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('this', 'Node')
                    .relationship('REL', constants_1.Direction.BOTH)
                    .to('that')
                    .return('this', 'that')
                    .build().cypher;
                expect(cypher).toBe([
                    "MATCH (this:Node)-[:REL]-(that)",
                    "RETURN this, that",
                ].join('\n'));
            });
            test('should build a pattern with properties', function () {
                var builder = new __1.default();
                var _a = builder
                    .match('this', 'Node')
                    .relationship('REL', constants_1.Direction.BOTH, null, { prop: 'value' })
                    .to('that', 'Node')
                    .return('this', 'that')
                    .build(), cypher = _a.cypher, params = _a.params;
                expect(cypher).toBe([
                    "MATCH (this:Node)-[:REL {prop: $prop}]-(that:Node)",
                    "RETURN this, that",
                ].join('\n'));
                expect(params).toEqual({ prop: 'value' });
            });
            test('should build a pattern with degrees', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('this', 'Node')
                    .relationship('REL', constants_1.Direction.BOTH, 'n', {}, 3)
                    .to('that', 'Node')
                    .return('this', 'that')
                    .build().cypher;
                expect(cypher).toBe([
                    "MATCH (this:Node)-[n:REL*3]-(that:Node)",
                    "RETURN this, that",
                ].join('\n'));
            });
            test('should build a pattern with multiple relationship types', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('this', 'Node')
                    .relationship(['REL1', 'REL2'], constants_1.Direction.BOTH, 'n', {}, 3)
                    .to('that', 'Node')
                    .return('this', 'that')
                    .build().cypher;
                expect(cypher).toBe([
                    "MATCH (this:Node)-[n:REL1|REL2*3]-(that:Node)",
                    "RETURN this, that",
                ].join('\n'));
            });
        });
        describe('::optionalMatch', function () {
            test('should write an optional match', function () {
                var builder = new __1.default();
                var cypher = builder
                    .match('this', 'Node')
                    .optionalMatch('that', 'Node', { prop: 'value' })
                    .return('this', 'that')
                    .toString();
                expect(cypher).toBe([
                    "MATCH (this:Node)",
                    "OPTIONAL MATCH (that:Node {prop: $that_prop})",
                    "RETURN this, that",
                ].join('\n'));
            });
        });
    });
    describe('WHERE', function () {
        test('should accept an object', function () {
            var builder = new __1.default();
            var _a = builder
                .match('this', 'Node')
                .where({ 'this.id': 1 })
                .return('this')
                .build(), cypher = _a.cypher, params = _a.params;
            expect(cypher).toBe("MATCH (this:Node)\nWHERE (this.id = $this_id)\nRETURN this");
            expect(params).toEqual({ this_id: neo4j_driver_1.int(1) });
        });
        test('should accept an object with more than one item', function () {
            var builder = new __1.default();
            var _a = builder
                .match('this', 'Node')
                .where({ 'this.id': 1, 'this.name': 'name' })
                .return('this')
                .build(), cypher = _a.cypher, params = _a.params;
            expect(cypher).toBe("MATCH (this:Node)\nWHERE (this.id = $this_id AND this.name = $this_name)\nRETURN this");
            expect(params).toEqual({ this_id: neo4j_driver_1.int(1), this_name: 'name' });
        });
        test('should accept an instance of a WhereStatement', function () {
            var q1 = (new where_statement_1.default())
                .where('this', 'that')
                .or('that', 'this');
            var q2 = (new where_statement_1.default())
                .where('this', 'this')
                .or('that', 'that');
            var builder = new __1.default();
            var _a = builder
                .match('this', 'Node')
                .where(q1)
                .or(q2)
                .return('this')
                .build(), cypher = _a.cypher, params = _a.params;
            expect(cypher).toBe([
                "MATCH (this:Node)",
                "WHERE ((this = $that OR that = $this))",
                "OR ((this = $this OR that = $that))",
                "RETURN this"
            ].join('\n'));
        });
    });
    describe('::delete', function () {
        it('should build a delete statement', function () {
            var builder = new __1.default();
            var cypher = builder
                .match('n')
                .delete('n')
                .toString();
            expect(cypher).toBe([
                "MATCH (n)",
                "DELETE n"
            ].join('\n'));
        });
    });
    describe('::detachDelete', function () {
        it('should build a detach delete statement', function () {
            var builder = new __1.default();
            var cypher = builder
                .match('n')
                .detachDelete('n')
                .toString();
            expect(cypher).toBe([
                "MATCH (n)",
                "DETACH DELETE n"
            ].join('\n'));
        });
    });
    describe('::remove', function () {
        it('should  remove a property', function () {
            var builder = new __1.default();
            var cypher = builder
                .match('n')
                .remove('n.this', 'n.that')
                .toString();
            expect(cypher).toBe([
                "MATCH (n)",
                "REMOVE n.this, n.that"
            ].join('\n'));
        });
    });
    describe('CREATE', function () {
        it('should build a create statement for a node', function () {
            var builder = new __1.default();
            var cypher = builder
                .create('n', 'Node', { prop: 'value' })
                .toString();
            expect(cypher).toBe([
                "CREATE (n:Node {prop: $n_prop})"
            ].join('\n'));
        });
        it('should build a create statement for a pattern', function () {
            var builder = new __1.default();
            var _a = builder
                .create('n', 'Node', { nProp: 'node' })
                .relationship('REL_TO', constants_1.Direction.OUTGOING, null, { relProp: 'rel' })
                .to('m', 'Node', { mProp: true })
                .build(), cypher = _a.cypher, params = _a.params;
            expect(cypher).toBe([
                "CREATE (n:Node {nProp: $n_nProp})-[:REL_TO {relProp: $relProp}]->(m:Node {mProp: $mProp})"
            ].join('\n'));
            expect(params).toEqual({
                n_nProp: 'node',
                relProp: 'rel',
                mProp: true
            });
        });
        it('should build a statement with many mixed clauses', function () {
            var builder = new __1.default();
            var cypher = builder
                .match('n', 'Node', { id: 'this' })
                .match('m', 'Node', { id: 'that' })
                .create('n')
                .relationship('REL_TO', constants_1.Direction.OUTGOING, null, { relProp: 'rel' })
                .to('m')
                .toString();
            expect(cypher).toBe([
                "MATCH (n:Node {id: $n_id})",
                "MATCH (m:Node {id: $m_id})",
                "CREATE (n)-[:REL_TO {relProp: $relProp}]->(m)",
            ].join('\n'));
        });
    });
    describe('MERGE', function () {
        it('should build a create statement for a node', function () {
            var builder = new __1.default();
            var cypher = builder
                .merge('n', 'Node', { prop: 'value' })
                .toString();
            expect(cypher).toBe([
                "MERGE (n:Node {prop: $n_prop})"
            ].join('\n'));
        });
        it('should build a create statement for a pattern', function () {
            var builder = new __1.default();
            var cypher = builder
                .merge('n', 'Node', { nodeProp: 'node' })
                .relationship('REL_TO', constants_1.Direction.OUTGOING, null, { relProp: 'rel' })
                .to('m', 'Node')
                .toString();
            expect(cypher).toBe([
                "MERGE (n:Node {nodeProp: $n_nodeProp})-[:REL_TO {relProp: $relProp}]->(m:Node)"
            ].join('\n'));
        });
        it('should build a statement with many mixed clauses', function () {
            var builder = new __1.default();
            var cypher = builder
                .match('n', 'Node', { id: 'this' })
                .match('m', 'Node', { id: 'that' })
                .merge('n')
                .relationship('REL_TO', constants_1.Direction.OUTGOING, null, { relProp: 'rel' })
                .to('m')
                .toString();
            expect(cypher).toBe([
                "MATCH (n:Node {id: $n_id})",
                "MATCH (m:Node {id: $m_id})",
                "MERGE (n)-[:REL_TO {relProp: $relProp}]->(m)",
            ].join('\n'));
        });
        it('should combine MERGE, ON MATCH SET, ON CREATE SET AND SET', function () {
            var builder = new __1.default();
            var cypher = builder
                .merge('n', 'Node', { id: 'this' })
                .onCreateSet('n.createdAt', 'now')
                .onMatchSet('n.updatedAt', 'now')
                .set('n.prop', 'true')
                .toString();
            expect(cypher).toBe([
                "MERGE (n:Node {id: $n_id})",
                "ON CREATE SET n.createdAt = $n_createdAt",
                "ON MATCH SET n.updatedAt = $n_updatedAt",
                "SET n.prop = $n_prop",
            ].join('\n'));
        });
        it('should accept multiple ON MATCH SET, ON CREATE SET AND SET statements', function () {
            var builder = new __1.default();
            var cypher = builder
                .merge('n', 'Node', { id: 'this' })
                .onCreateSet('n.createdAt', 'now')
                .onCreateSet('n.created', true)
                .onMatchSet('n.updatedAt', 'now')
                .onMatchSet('n.updated', true)
                .set('n.prop', 'true')
                .set('n.set', true)
                .toString();
            expect(cypher).toBe([
                "MERGE (n:Node {id: $n_id})",
                "ON CREATE SET n.createdAt = $n_createdAt, n.created = $n_created",
                "ON MATCH SET n.updatedAt = $n_updatedAt, n.updated = $n_updated",
                "SET n.prop = $n_prop, n.set = $n_set",
            ].join('\n'));
        });
        it('should mass assign an object', function () {
            var builder = new __1.default();
            var value = { id: 1, massAssign: true };
            var _a = builder
                .merge('n', 'Node', { id: 'this' })
                .set('n', value)
                .build(), cypher = _a.cypher, params = _a.params;
            expect(cypher).toBe([
                "MERGE (n:Node {id: $n_id})",
                "SET n = $n",
            ].join('\n'));
            // @ts-ignore
            expect(params.n).toBe(value);
        });
        it('should append with += syntax', function () {
            var builder = new __1.default();
            var value = { id: 1, massAssign: true };
            var _a = builder
                .merge('n', 'Node', { id: 'this' })
                .setAppend('n', value)
                .build(), cypher = _a.cypher, params = _a.params;
            expect(cypher).toBe([
                "MERGE (n:Node {id: $n_id})",
                "SET n += $n",
            ].join('\n'));
            // @ts-ignore
            expect(params.n).toBe(value);
        });
    });
    describe('::setParam', function () {
        test('should set a param', function () {
            var builder = new __1.default();
            var key = 'key';
            var value = 'value';
            builder.setParam(key, value);
            expect(builder.getParams()[key]).toEqual(value);
        });
    });
});
