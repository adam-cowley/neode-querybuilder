# neode-querybuilder

This package provides a fluent interface for building cypher queries - and is heavily used in [Neode](https://github.com/adam-cowley/neode).  It will take care of parameterisation for you so your queries will be safe.


## Getting Started

### Installation

You can install this package using your favourite package manager:

```
npm install --save @neode/querybuilder
```

### Usage

The builder has a number of methods that can be used to build up a cypher query.  Say you want a query like:

```cypher
MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
WHERE m.released >= 2003
RETURN p, m
LIMIT 10
```

The javascript code would look something like:


```js
import Builder, { Direction } from '@neode/querybuilder'

const builder = new Builder

// Create a statement
builder.match('p', 'Person', { name: 'Keanu Reeves' })
    .relationship('ACTED_IN', Direction.OUTGOING)
    .to('m', 'Movie')
    .whereGreaterThanOrEqual('m.released', 2003)
    .return('p', 'm')
    .limit(10)

// Get the Cypher statement as a string
const queryAsString = builder.toString()

// Get the query and the params built up by the instance
const { cypher, params } = builder.build()
````

#### Using with Neode

You can pass the cypher and params straight into `.cypher` and then use `.hydrate` to convert the result into a Neode model.

```js
const { cypher, params } = (new Builder())
    .match('n', 'Node')
    .where('n.id', 1)
    .return('n')
    .build()

neode.cypher(query, params)
    .then(res => neode.hydrateFirst('n'))
    .then(node => console.log( node.id() ))
```

### Simple Queries

By default, the builder will produce a single where clause:

```js
builder.match('n', 'Person')
    .where('n.name', 'Keanu Reeves')
    .or('n.name', 'Laurence Fishburn')
    .toString()
```

Will produce something along the lines of:

```cypher
MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
WHERE (n.name = $n_name1 OR n.name = $n_name2)
RETURN p, m
LIMIT 10
```

### More complex Where clauses

If you need something more complex, you can also pass an instance of the `WhereStatement`:

```js
// First add the parameters to the builder
builder.setParam('matrixReleasedAfter', 2000)
builder.setParam('atlasReleasedBefore', 2000)

// Then create new instances of WhereStatement using those parameters
builder
    .match('p', 'Person', { name: 'Keanu Reeves' })
    .relationship('ACTED_IN', Direction.OUTGOING)
    .to('m', 'Movie')
    .where(
        (new WhereStatement())
            .whereContains('m.title', 'Matrix')
            .whereGreaterThan('m.released', 'matrixReleasedBefore') // Reference set above
    )
    .or(
        (new WhereStatement())
            .whereEndsWith('m.title', 'Atlas')
            .whereLessThanOrEqual('m.released', 'atlasReleasedBefore') // Reference set above
    )
    .return('p', 'm')
    .limit(10)
```

This will produce:

```cypher
MATCH (p:Person {name: $p_name})-[:ACTED_IN]->(m:Movie)
WHERE ((m.title CONTAINS $Matrix AND m.released > $matrixReleasedBefore))
OR ((m.title ENDS WITH $Atlas AND m.released <= $atlasReleasedBefore))
RETURN p, m
LIMIT 10
```

## Reference

```ts
export default class Builder<T> {
    setParam(key: string, value: any): Builder<T>;
    match<T>(alias: string, labels?: Array<string> | string, properties?: object): Builder<T>;
    call(fn: string, ...parameters: any[]): Builder<T>;
    yield(...items: string[]): Builder<T>;
    optionalMatch<T>(alias: string, labels?: Array<string> | string, properties?: object): Builder<T>;
    create<T>(alias: string, labels?: Array<string> | string, properties?: object): Builder<T>;
    merge<T>(alias: string, labels?: Array<string> | string, properties?: object): Builder<T>;
    relationship(type: string | string[], direction?: Direction, alias?: string | null, properties?: object | undefined, degrees?: number | string): Builder<T>;
    to(alias?: string | undefined, labels?: Array<string> | string, properties?: object | undefined): Builder<T>;
    onCreateSet(key: string, value: any): Builder<T>;
    onMatchSet(key: string, value: any): Builder<T>;
    set(key: string, value: any): Builder<T>;
    remove(...values: string[]): this;
    setAppend(key: string, value: object): Builder<T>;
    where(key: string | WhereStatement | object, value?: any | undefined): Builder<T>;
    whereNot(key: string | object, value?: any | undefined): Builder<T>;
    whereId(alias: string, id: number): Builder<T>;
    whereNotId(alias: string, id: number): Builder<T>;
    whereRaw(predicate: string): Builder<T>;
    whereLike(key: string, value: any): Builder<T>;
    whereNotLike(key: string, value: any): Builder<T>;
    whereStartsWith(key: string, value: any): Builder<T>;
    whereNotStartsWith(key: string, value: any): Builder<T>;
    whereEndsWith(key: string, value: any): Builder<T>;
    whereNotEndsWith(key: string, value: any): Builder<T>;
    whereContains(key: string, value: any): Builder<T>;
    whereNotContains(key: string, value: any): Builder<T>;
    whereGreaterThan(key: string, value: any): Builder<T>;
    whereGreaterThanOrEqual(key: string, value: any): Builder<T>;
    whereLessThan(key: string, value: any): Builder<T>;
    whereLessThanOrEqual(key: string, value: any): Builder<T>;
    whereBetween(key: string, floor: any, ceiling: any): Builder<T>;
    delete(...items: string[]): Builder<T>;
    detachDelete(...items: string[]): Builder<T>;
    orderBy(key: string, order?: Order): Builder<T>;
    or(key: string | object, value?: any | undefined): Builder<T>;
    skip(skip: number): Builder<T>;
    limit(limit: number): Builder<T>;
    return(...values: Array<string>): Builder<T>;
    with(...items: string[]): Builder<T>;
    getParams(): Params;
    build(): BuiltCypher;
    toString(): string;
}
```