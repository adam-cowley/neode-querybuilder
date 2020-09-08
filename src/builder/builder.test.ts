import Builder from '..'
import { int } from 'neo4j-driver'
import WhereStatement from '../statements/where-statement'
import { Order, Direction } from '../constants'

describe('Builder', () => {

    describe('::constructor', () => {
        test('Should construct', () => {
            const builder = new Builder()

            expect(builder).toBeInstanceOf(Builder)
        })
    })

    describe('MATCH', () => {
        test('should return itself', () => {
            const builder = new Builder()

            const match = builder.match('a')

            expect(match).toEqual(builder)
        })

        test('should make a match with only an alias', () => {
            const builder = new Builder()

            const cypher = builder.match('n')
                .return('n')
                .toString()

            expect(cypher).toBe(`MATCH (n)\nRETURN n`)
        })

        test('should make a query with a single label', () => {
            const builder = new Builder()

            const cypher = builder.match('n', 'Node')
                .return('n')
                .toString()

            expect(cypher).toBe(`MATCH (n:Node)\nRETURN n`)
        })

        test('should make a query with an array of labels', () => {
            const builder = new Builder()

            const cypher = builder.match('n', ['Node', 'Entity'])
                .return('n')
                .toString()

            expect(cypher).toBe(`MATCH (n:Node:Entity)\nRETURN n`)
        })

        test('should make a query with a single label and properties', () => {
            const builder = new Builder()

            const cypher = builder.match('n', 'Node', { id: 1, active: true })
                .return('n')
                .toString()

            expect(cypher).toBe(`MATCH (n:Node {id: $n_id, active: $n_active})\nRETURN n`)
        })

        describe('::whereNot', () => {
            test('should accept a string and value', () => {
                const builder = new Builder()

                const { cypher, params } = builder
                    .match('this', 'Node')
                    .whereNot('this.id', 1)
                    .return('this')
                    .build()

                expect(cypher).toBe(`MATCH (this:Node)\nWHERE (NOT this.id = $this_id)\nRETURN this`)
                expect(params).toEqual({ this_id: int(1) })
            })

            test('should accept an object', () => {
                const builder = new Builder()

                const { cypher, params } = builder
                    .match('this', 'Node')
                    .whereNot({ 'this.id': 1 })
                    .return('this')
                    .build()

                expect(cypher).toBe(`MATCH (this:Node)\nWHERE (NOT this.id = $this_id)\nRETURN this`)
                expect(params).toEqual({ this_id: int(1) })
            })

            test('should accept an object with more than one item', () => {
                const builder = new Builder()

                const { cypher, params } = builder
                    .match('this', 'Node')
                    .whereNot({ 'this.id': 1, 'this.name': 'name' })
                    .return('this')
                    .build()

                expect(cypher).toBe(`MATCH (this:Node)\nWHERE (NOT this.id = $this_id AND NOT this.name = $this_name)\nRETURN this`)
                expect(params).toEqual({ this_id: int(1), this_name: 'name' })
            })
        })

        describe('::whereId', () => {
            test('should build a match query on an internal ID', () => {
                const builder = new Builder()

                const cypher = builder.match('n', 'Node')
                    .whereId('n', 1)
                    .return('n')
                    .toString()

                expect(cypher).toBe(`MATCH (n:Node)\nWHERE (id(n) = $n__id)\nRETURN n`)
                expect(builder.getParams()).toEqual({ n__id: int(1) })
            })

            test('should build multiple MATCH statements', () => {
                const builder = new Builder()

                const cypher = builder
                    .match('this', 'Node').whereId('this', 1)
                    .match('that', 'Node').whereId('that', 2)
                    .return('this', 'that')
                    .toString()

                expect(cypher).toBe([
                    `MATCH (this:Node)\nWHERE (id(this) = $this__id)`,
                    `MATCH (that:Node)\nWHERE (id(that) = $that__id)`,
                    `RETURN this, that`
                ].join('\n'))
                expect(builder.getParams()).toEqual({ this__id: int(1), that__id: int(2) })
            })
        })

        describe('::whereNotId', () => {
            test('should build a match query on an internal ID', () => {
                const builder = new Builder()

                const cypher = builder.match('n', 'Node')
                    .whereNotId('n', 1)
                    .return('n')
                    .toString()

                expect(cypher).toBe(`MATCH (n:Node)\nWHERE (NOT id(n) = $n__id)\nRETURN n`)
                expect(builder.getParams()).toEqual({ n__id: int(1) })
            })
        })

        describe('::whereRaw', () => {
            test('should mix raw predicates with regular ones', () => {
                const builder = new Builder()

                const { cypher, params } = builder
                    .match('this', 'Node')
                    .where({ 'this.id': 1 })
                    .whereRaw(`this.name STARTS WITH 'n'`)
                    .return('this')
                    .build()

                expect(cypher).toBe(`MATCH (this:Node)\nWHERE (this.id = $this_id AND this.name STARTS WITH 'n')\nRETURN this`)
                expect(params).toEqual({ this_id: int(1) })
            })
        })

        describe('::whereLike', () => {
            it('should build a like clause', () => {
                const builder = new Builder()

                const cypher = builder
                    .match('n')
                    .whereLike('n.prop', 'value')
                    .return('n')
                    .toString()

                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (n.prop LIKE $n_prop)',
                    'RETURN n'
                ].join('\n'))
            })
        })

        describe('::whereNotLike', () => {
            it('should build a not like clause', () => {
                const builder = new Builder()

                const cypher = builder
                    .match('n')
                    .whereNotLike('n.prop', 'value')
                    .return('n')
                    .toString()

                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (NOT n.prop LIKE $n_prop)',
                    'RETURN n'
                ].join('\n'))
            })
        })

        describe('::whereStartsWith', () => {
            it('should build a starts with clause', () => {
                const builder = new Builder()

                const cypher = builder
                    .match('n')
                    .whereStartsWith('n.prop', 'value')
                    .return('n')
                    .toString()

                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (n.prop STARTS WITH $n_prop)',
                    'RETURN n'
                ].join('\n'))
            })
        })

        describe('::whereNotStartsWith', () => {
            it('should build a negative starts with clause', () => {
                const builder = new Builder()

                const cypher = builder
                    .match('n')
                    .whereNotStartsWith('n.prop', 'value')
                    .return('n')
                    .toString()

                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (NOT n.prop STARTS WITH $n_prop)',
                    'RETURN n'
                ].join('\n'))
            })
        })

        describe('::whereEndsWith', () => {
            it('should build a Ends with clause', () => {
                const builder = new Builder()

                const cypher = builder
                    .match('n')
                    .whereEndsWith('n.prop', 'value')
                    .return('n')
                    .toString()

                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (n.prop ENDS WITH $n_prop)',
                    'RETURN n'
                ].join('\n'))
            })
        })

        describe('::whereNotEndsWith', () => {
            it('should build a negative Ends with clause', () => {
                const builder = new Builder()

                const cypher = builder
                    .match('n')
                    .whereNotEndsWith('n.prop', 'value')
                    .return('n')
                    .toString()

                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (NOT n.prop ENDS WITH $n_prop)',
                    'RETURN n'
                ].join('\n'))
            })
        })

        describe('::whereContains', () => {
            it('should build a Contains clause', () => {
                const builder = new Builder()

                const cypher = builder
                    .match('n')
                    .whereContains('n.prop', 'value')
                    .return('n')
                    .toString()

                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (n.prop CONTAINS $n_prop)',
                    'RETURN n'
                ].join('\n'))
            })
        })

        describe('::whereNotContains', () => {
            it('should build a Contains clause', () => {
                const builder = new Builder()

                const cypher = builder
                    .match('n')
                    .whereNotContains('n.prop', 'value')
                    .return('n')
                    .toString()

                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (NOT n.prop CONTAINS $n_prop)',
                    'RETURN n'
                ].join('\n'))
            })
        })

        describe('::greaterThan', () => {
            it('should build a Greater Than clause', () => {
                const builder = new Builder()

                const cypher = builder
                    .match('n')
                    .whereGreaterThan('n.prop', 'value')
                    .return('n')
                    .toString()

                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (n.prop > $n_prop)',
                    'RETURN n'
                ].join('\n'))
            })
        })

        describe('::greaterThanOrEqual', () => {
            it('should build a Greater Than or equal clause', () => {
                const builder = new Builder()

                const cypher = builder
                    .match('n')
                    .whereGreaterThanOrEqual('n.prop', 'value')
                    .return('n')
                    .toString()

                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (n.prop >= $n_prop)',
                    'RETURN n'
                ].join('\n'))
            })
        })

        describe('::lessThan', () => {
            it('should build a Less Than clause', () => {
                const builder = new Builder()

                const cypher = builder
                    .match('n')
                    .whereLessThan('n.prop', 'value')
                    .return('n')
                    .toString()

                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (n.prop < $n_prop)',
                    'RETURN n'
                ].join('\n'))
            })
        })

        describe('::lessThanOrEqual', () => {
            it('should build a Less Than or equal clause', () => {
                const builder = new Builder()

                const cypher = builder
                    .match('n')
                    .whereLessThanOrEqual('n.prop', 'value')
                    .return('n')
                    .toString()

                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (n.prop <= $n_prop)',
                    'RETURN n'
                ].join('\n'))
            })
        })

        describe('::between', () => {
            it('should build a between clause', () => {
                const builder = new Builder()

                const { cypher, params } = builder
                    .match('n')
                    .whereBetween('n.prop', 1, 10)
                    .return('n')
                    .build()

                expect(cypher).toBe([
                    'MATCH (n)',
                    'WHERE (n.prop BETWEEN $n_prop AND $n_prop2)',
                    'RETURN n'
                ].join('\n'))

                expect(params).toEqual({
                    n_prop: int(1),
                    n_prop2: int(10) ,
                })
            })
        })

        describe('::or', () => {
            test('should build an `or` query', () => {
                const builder = new Builder();

                const { cypher, params } = builder
                    .match('this', 'Node')
                    .where('this.property', 'that')
                    .or('this.other_property', 'not that')
                    .return('this')
                    .build();

                expect(cypher).toBe([
                    `MATCH (this:Node)`,
                    `WHERE (this.property = $this_property)`,
                    `OR (this.other_property = $this_other_property)`,
                    `RETURN this`
                ].join('\n'))

                expect(params).toEqual({
                    this_property: 'that',
                    this_other_property: 'not that'
                })
            })

            test('should accept an object in `.or()`', () => {
                const builder = new Builder();

                const { cypher, params } = builder
                    .match('this', 'Node')
                    .where('this.property', 'that')
                    .or({
                        'this.other_property': 'other',
                        'this.foo_property': 'bar',
                    })
                    .return('this')
                    .build();

                expect(cypher).toBe([
                    `MATCH (this:Node)`,
                    `WHERE (this.property = $this_property)`,
                    `OR (this.other_property = $this_other_property AND this.foo_property = $this_foo_property)`,
                    `RETURN this`
                ].join('\n'))

                expect(params).toEqual({
                    this_property: 'that',
                    this_other_property: 'other',
                    this_foo_property: 'bar',
                })
            })

            test('should increment param if one already exists', () => {
                const builder = new Builder()

                const { cypher, params } = builder
                    .match('this', 'Node')
                    .where('this.id', 1)
                    .or('this.id', 2)
                    .return('this')
                    .build()

                expect(params).toEqual({
                    this_id: int(1),
                    this_id2: int(2),
                })
            })
        })

        describe('::skip', () => {
            test('should handle a skip', () => {
                const builder = new Builder();

                const { cypher } = builder
                    .match('this', 'Node')
                    .return('this')
                    .skip(10)
                    .build();

                    expect(cypher).toBe([
                        `MATCH (this:Node)`,
                        `RETURN this`,
                        `SKIP 10`,
                    ].join('\n'))
            })
        })

        describe('::limit', () => {
            test('should handle a skip and limit', () => {
                const builder = new Builder()

                const { cypher } = builder
                    .match('this', 'Node')
                    .return('this')
                    .skip(10)
                    .limit(20)
                    .build();

                    expect(cypher).toBe([
                        `MATCH (this:Node)`,
                        `RETURN this`,
                        `SKIP 10`,
                        `LIMIT 20`,
                    ].join('\n'))
            })
        })

        describe('::with', () => {
            test('should apply a with statement', () => {
                const builder = new Builder()

                const { cypher } = builder
                    .match('this', 'Node')
                    .with('this')
                    .where('this.id', 1)
                    .return('this')
                    .skip(10)
                    .limit(20)
                    .build();

                    expect(cypher).toBe([
                    `MATCH (this:Node)`,
                    `WITH this`,
                    `WHERE (this.id = $this_id)`,
                    `RETURN this`,
                    `SKIP 10`,
                    `LIMIT 20`,
                ].join('\n'))
            })
        })

        describe('::orderBy', () => {
            test('should be ascending order by default', () => {
                const builder = new Builder()

                const { cypher } = builder
                    .match('this', 'Node')
                    .return('this')
                    .orderBy('this.id')
                    .build();

                expect(cypher).toBe([
                    `MATCH (this:Node)`,
                    `RETURN this`,
                    `ORDER BY this.id ASC`,
                ].join('\n'))
            })
            test('should sort in ascending order', () => {
                const builder = new Builder()

                const { cypher } = builder
                    .match('this', 'Node')
                    .return('this')
                    .orderBy('this.id', Order.ASC)
                    .build();

                expect(cypher).toBe([
                    `MATCH (this:Node)`,
                    `RETURN this`,
                    `ORDER BY this.id ASC`,
                ].join('\n'))
            })

            test('should sort in descending order', () => {
                const builder = new Builder()

                const { cypher } = builder
                    .match('this', 'Node')
                    .return('this')
                    .orderBy('this.id', Order.DESC)
                    .build();

                expect(cypher).toBe([
                    `MATCH (this:Node)`,
                    `RETURN this`,
                    `ORDER BY this.id DESC`,
                ].join('\n'))
            })

            test('should accept multiple order statements', () => {
                const builder = new Builder()

                const { cypher } = builder
                    .match('this', 'Node')
                    .return('this')
                    .orderBy('this.id', Order.DESC)
                    .orderBy('this.name', Order.ASC)
                    .build();

                expect(cypher).toBe([
                    `MATCH (this:Node)`,
                    `RETURN this`,
                    `ORDER BY this.id DESC, this.name ASC`,
                ].join('\n'))
            })

            test('TODO: should build a query with an array of string order statements', () => {})
            test('TODO: should build a query with an order object', () => {})
            test('TODO: should build a query with an array of order object', () => {})
        })

        describe('::relationship', () => {
            test('should build a pattern without a direction', () => {
                const builder = new Builder()

                const { cypher } = builder
                    .match('this', 'Node')
                    .relationship('REL')
                    .to()
                    .return('this')
                    .orderBy('this.id', Order.DESC)
                    .orderBy('this.name', Order.ASC)
                    .build();

                expect(cypher).toBe([
                    `MATCH (this:Node)-[:REL]-()`,
                    `RETURN this`,
                    `ORDER BY this.id DESC, this.name ASC`,
                ].join('\n'))
            })

            test('should build a pattern with an outgoing direction', () => {
                const builder = new Builder()

                const { cypher } = builder
                    .match('this', 'Node')
                    .relationship('REL', Direction.OUTGOING)
                    .to()
                    .return('this')
                    .build();

                expect(cypher).toBe([
                    `MATCH (this:Node)-[:REL]->()`,
                    `RETURN this`,
                ].join('\n'))
            })
            test('should build a pattern with an incoming direction', () => {
                const builder = new Builder()

                const { cypher } = builder
                    .match('this', 'Node')
                    .relationship('REL', Direction.INCOMING)
                    .to('that')
                    .return('this')
                    .build();

                expect(cypher).toBe([
                    `MATCH (this:Node)<-[:REL]-(that)`,
                    `RETURN this`,
                ].join('\n'))
            })

            test('should build a pattern with both directions', () => {
                const builder = new Builder()

                const { cypher } = builder
                    .match('this', 'Node')
                    .relationship('REL', Direction.BOTH)
                    .to('that')
                    .return('this', 'that')
                    .build();

                expect(cypher).toBe([
                    `MATCH (this:Node)-[:REL]-(that)`,
                    `RETURN this, that`,
                ].join('\n'))
            })

            test('should build a pattern with properties', () => {
                const builder = new Builder()

                const { cypher, params } = builder
                    .match('this', 'Node')
                    .relationship('REL', Direction.BOTH, null, {prop: 'value'})
                    .to('that', 'Node')
                    .return('this', 'that')
                    .build();

                expect(cypher).toBe([
                    `MATCH (this:Node)-[:REL {prop: $prop}]-(that:Node)`,
                    `RETURN this, that`,
                ].join('\n'))

                expect(params).toEqual({prop: 'value'})
            })

            test('should build a pattern with degrees', () => {
                const builder = new Builder()

                const { cypher } = builder
                    .match('this', 'Node')
                    .relationship('REL', Direction.BOTH, 'n', {}, 3)
                    .to('that', 'Node')
                    .return('this', 'that')
                    .build();

                expect(cypher).toBe([
                    `MATCH (this:Node)-[n:REL*3]-(that:Node)`,
                    `RETURN this, that`,
                ].join('\n'))

            })
            test('should build a pattern with multiple relationship types', () => {
                const builder = new Builder()

                const { cypher } = builder
                    .match('this', 'Node')
                    .relationship(['REL1', 'REL2'], Direction.BOTH, 'n', {}, 3)
                    .to('that', 'Node')
                    .return('this', 'that')
                    .build();

                expect(cypher).toBe([
                    `MATCH (this:Node)-[n:REL1|REL2*3]-(that:Node)`,
                    `RETURN this, that`,
                ].join('\n'))
            })
        })

        describe('::optionalMatch', () => {
            test('should write an optional match', () => {
                const builder = new Builder()

                const cypher = builder
                    .match('this', 'Node')
                    .optionalMatch('that', 'Node', { prop: 'value' })
                    .return('this', 'that')
                    .toString()

                expect(cypher).toBe([
                    `MATCH (this:Node)`,
                    `OPTIONAL MATCH (that:Node {prop: $that_prop})`,
                    `RETURN this, that`,
                ].join('\n'))
            })
        })
    })

    describe('WHERE', () => {
        test('should accept an object', () => {
            const builder = new Builder()

            const { cypher, params } = builder
                .match('this', 'Node')
                .where({ 'this.id': 1 })
                .return('this')
                .build()

            expect(cypher).toBe(`MATCH (this:Node)\nWHERE (this.id = $this_id)\nRETURN this`)
            expect(params).toEqual({ this_id: int(1) })
        })

        test('should accept an object with more than one item', () => {
            const builder = new Builder()

            const { cypher, params } = builder
                .match('this', 'Node')
                .where({ 'this.id': 1, 'this.name': 'name' })
                .return('this')
                .build()

            expect(cypher).toBe(`MATCH (this:Node)\nWHERE (this.id = $this_id AND this.name = $this_name)\nRETURN this`)
            expect(params).toEqual({ this_id: int(1), this_name: 'name' })
        })

        test('should accept an instance of a WhereStatement', () => {

            const q1 = (new WhereStatement())
                .where('this', 'that')
                .or('that', 'this')

            const q2 = (new WhereStatement())
                .where('this', 'this')
                .or('that', 'that')


            const builder = new Builder()

            const { cypher, params } = builder
                .match('this', 'Node')
                .where(q1)
                .or(q2)
                .return('this')
                .build()

            expect(cypher).toBe([
                `MATCH (this:Node)`,
                `WHERE ((this = $that OR that = $this))`,
                `OR ((this = $this OR that = $that))`,
                `RETURN this`
            ].join('\n'))
        })
    })

    describe('::delete', () => {
        it('should build a delete statement', () => {
            const builder = new Builder()

            const cypher = builder
                .match('n')
                .delete('n')
                .toString()

            expect(cypher).toBe([
                `MATCH (n)`,
                `DELETE n`
            ].join('\n'))
        })
    })

    describe('::detachDelete', () => {
        it('should build a detach delete statement', () => {
            const builder = new Builder()

            const cypher = builder
                .match('n')
                .detachDelete('n')
                .toString()

            expect(cypher).toBe([
                `MATCH (n)`,
                `DETACH DELETE n`
            ].join('\n'))
        })
    })

    describe('::remove', () => {
        it('should  remove a property', () => {
            const builder = new Builder()

            const cypher = builder
                .match('n')
                .remove('n.this', 'n.that')
                .toString()

            expect(cypher).toBe([
                `MATCH (n)`,
                `REMOVE n.this, n.that`
            ].join('\n'))
        })
    })

    describe('CREATE', () => {
        it('should build a create statement for a node', () => {
            const builder = new Builder()

            const cypher = builder
                .create('n', 'Node', { prop: 'value' })
                .toString()

            expect(cypher).toBe([
                `CREATE (n:Node {prop: $n_prop})`
            ].join('\n'))
        })

        it('should build a create statement for a pattern', () => {
            const builder = new Builder()

            const { cypher, params } = builder
                .create('n', 'Node', { nProp: 'node' })
                .relationship('REL_TO', Direction.OUTGOING, null, { relProp: 'rel' })
                .to('m', 'Node', { mProp: true })
                .build()

            expect(cypher).toBe([
                `CREATE (n:Node {nProp: $n_nProp})-[:REL_TO {relProp: $relProp}]->(m:Node {mProp: $mProp})`
            ].join('\n'))
            expect(params).toEqual({
                n_nProp: 'node',
                relProp: 'rel',
                mProp: true
            })
        })

        it('should build a statement with many mixed clauses', () => {
            const builder = new Builder()

            const cypher = builder
                .match('n', 'Node', { id: 'this' })
                .match('m', 'Node', { id: 'that' })
                .create('n')
                .relationship('REL_TO', Direction.OUTGOING, null, { relProp: 'rel' })
                .to('m')
                .toString()

            expect(cypher).toBe([
                `MATCH (n:Node {id: $n_id})`,
                `MATCH (m:Node {id: $m_id})`,
                `CREATE (n)-[:REL_TO {relProp: $relProp}]->(m)`,
            ].join('\n'))
        })
    })

    describe('MERGE', () => {
        it('should build a create statement for a node', () => {
            const builder = new Builder()

            const cypher = builder
                .merge('n', 'Node', { prop: 'value' })
                .toString()

            expect(cypher).toBe([
                `MERGE (n:Node {prop: $n_prop})`
            ].join('\n'))
        })

        it('should build a create statement for a pattern', () => {
            const builder = new Builder()

            const cypher = builder
                .merge('n', 'Node', { nodeProp: 'node' })
                .relationship('REL_TO', Direction.OUTGOING, null, { relProp: 'rel' })
                .to('m', 'Node')
                .toString()

            expect(cypher).toBe([
                `MERGE (n:Node {nodeProp: $n_nodeProp})-[:REL_TO {relProp: $relProp}]->(m:Node)`
            ].join('\n'))
        })

        it('should build a statement with many mixed clauses', () => {
            const builder = new Builder()

            const cypher = builder
                .match('n', 'Node', { id: 'this' })
                .match('m', 'Node', { id: 'that' })
                .merge('n')
                .relationship('REL_TO', Direction.OUTGOING, null, { relProp: 'rel' })
                .to('m')
                .toString()

            expect(cypher).toBe([
                `MATCH (n:Node {id: $n_id})`,
                `MATCH (m:Node {id: $m_id})`,
                `MERGE (n)-[:REL_TO {relProp: $relProp}]->(m)`,
            ].join('\n'))
        })

        it('should combine MERGE, ON MATCH SET, ON CREATE SET AND SET', () => {
            const builder = new Builder()

            const cypher = builder
                .merge('n', 'Node', { id: 'this' })
                .onCreateSet('n.createdAt', 'now')
                .onMatchSet('n.updatedAt', 'now')
                .set('n.prop', 'true')
                .toString()

                expect(cypher).toBe([
                    `MERGE (n:Node {id: $n_id})`,
                    `ON CREATE SET n.createdAt = $n_createdAt`,
                    `ON MATCH SET n.updatedAt = $n_updatedAt`,
                    `SET n.prop = $n_prop`,
                ].join('\n'))

            })
        it('should accept multiple ON MATCH SET, ON CREATE SET AND SET statements', () => {
            const builder = new Builder()

            const cypher = builder
                .merge('n', 'Node', { id: 'this' })
                .onCreateSet('n.createdAt', 'now')
                .onCreateSet('n.created', true)
                .onMatchSet('n.updatedAt', 'now')
                .onMatchSet('n.updated', true)
                .set('n.prop', 'true')
                .set('n.set', true)
                .toString()

                expect(cypher).toBe([
                    `MERGE (n:Node {id: $n_id})`,
                    `ON CREATE SET n.createdAt = $n_createdAt, n.created = $n_created`,
                    `ON MATCH SET n.updatedAt = $n_updatedAt, n.updated = $n_updated`,
                    `SET n.prop = $n_prop, n.set = $n_set`,
                ].join('\n'))
        })

        it('should mass assign an object', () => {
            const builder = new Builder()

            const value = { id: 1, massAssign: true }

            const { cypher, params } = builder
                .merge('n', 'Node', { id: 'this' })
                .set('n', value)
                .build()

                expect(cypher).toBe([
                    `MERGE (n:Node {id: $n_id})`,
                    `SET n = $n`,
                ].join('\n'))
                // @ts-ignore
                expect(params.n).toBe(value)
        })

        it('should append with += syntax', () => {
            const builder = new Builder()

            const value = { id: 1, massAssign: true }

            const { cypher, params } = builder
                .merge('n', 'Node', { id: 'this' })
                .setAppend('n', value)
                .build()

                expect(cypher).toBe([
                    `MERGE (n:Node {id: $n_id})`,
                    `SET n += $n`,
                ].join('\n'))
                // @ts-ignore
                expect(params.n).toBe(value)
        })
    })

    describe('CALL', () => {
        it('should call some apoc procedure and yield values', () => {
            const builder = new Builder()

            const cypher = builder.call('apoc.periodic.iterate', 'MATCH (n) RETURN n', 'DETACH DELETE n', { iterateList: true, parallel: true, batchSize: 1000 })
                .yield('total', 'batches', 'timeTaken')
                .whereGreaterThan('total', 10)
                .return('total', 'batches', 'timeTaken')
                .toString()

            expect(cypher).toEqual([
                `CALL apoc.periodic.iterate("MATCH (n) RETURN n", "DETACH DELETE n", {iterateList: true, parallel: true, batchSize: 1000})`,
                `YIELD total, batches, timeTaken`,
                `WHERE (total > $total)`,
                `RETURN total, batches, timeTaken`,
            ].join('\n'))
        })
    })

    describe('::setParam', () => {
        test('should set a param', () => {
            const builder = new Builder()

            const key = 'key'
            const value = 'value'

            builder.setParam(key, value)

            expect( builder.getParams()[ key ] ).toEqual(value)
        })
    })

    describe('::foreach', () => {
        it('should write foreach on simple value', () => {
            const builder = new Builder()

            const { cypher, params } = builder.match('a')
                .foreach(
                    'n',
                    [1,2,3],
                    (new Builder())
                        .merge('b', 'Test', { id: builder.raw('n') })
                        .merge('a').relationship('KNOWS').to('b')
                )
                .return('a')
                .build()

            expect(cypher).toEqual([
                `MATCH (a)`,
                `FOREACH ( n IN $n | MERGE (b:Test {id: n})`,
                `MERGE (a)-[:KNOWS]-(b) )`,
                `RETURN a`
            ].join('\n'))

            expect(params).toEqual({
                'n': [1, 2, 3]
            })
        })

        it('should write foreach on list of maps', () => {
            const builder = new Builder()

            const { cypher, params } = builder.match('a')
                .foreach(
                    'n',
                    [{id: 1},{id:2},{id:3}],
                    (new Builder())
                        .merge('b', 'Test', { id: builder.raw('n.id') })
                        .onCreateSet('b.foo', builder.raw('n.foo'))
                        .onCreateSet('b.bar', builder.raw('n.bar'))
                        .merge('a').relationship('KNOWS').to('b')
                )
                .return('a')
                .build()

            expect(cypher).toEqual([
                `MATCH (a)`,
                `FOREACH ( n IN $n | MERGE (b:Test {id: n.id})`,
                `ON CREATE SET b.foo = n.foo, b.bar = n.bar`,
                `MERGE (a)-[:KNOWS]-(b) )`,
                `RETURN a`
            ].join('\n'))

            expect(params).toEqual({
                'n': [{id: 1}, {id: 2}, {id: 3}]
            })
        })
    })
})