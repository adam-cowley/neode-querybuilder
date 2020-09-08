import { int } from 'neo4j-driver'
import Statement from '../statements/statement'
import Property from '../property';
import WhereStatement from '../statements/where-statement';
import  { Condition, Prefix, StatementPrefix, Order, Direction, Operator } from '../constants'
import Raw from '../raw';

interface Params {
    [ key: string ]: any
}

export default class Builder<T> {

    public params: Params = {};

    public statements: Array<Statement<T>> = [];

    setParam(key: string, value: any): Builder<T> {
        this.params[ key ] = value;

        return this
    }

    match<T>(alias: string, labels?: Array<string> | string, properties?: object) : Builder<T> {
        this.addStatement(StatementPrefix.MATCH)

        this.currentStatement().match(alias, labels, this.aliasProperties(alias, properties) )

        return this
    }

    call(fn: string, ...parameters: any[]) : Builder<T> {
        this.addStatement(StatementPrefix.CALL)

        this.currentStatement().call(fn, ...parameters)

        return this
    }

    yield(...items: string[]) : Builder<T> {
        this.currentStatement().yield(...items)

        return this
    }

    optionalMatch<T>(alias: string, labels?: Array<string> | string, properties?: object) : Builder<T> {
        this.addStatement(StatementPrefix.OPTIONAL_MATCH)

        this.currentStatement().match(alias, labels, this.aliasProperties(alias, properties) )

        return this
    }

    create<T>(alias: string, labels?: Array<string> | string, properties?: object) : Builder<T> {
        this.addStatement(StatementPrefix.CREATE)

        this.currentStatement().match(alias, labels, this.aliasProperties(alias, properties) )

        return this
    }

    merge<T>(alias: string, labels?: Array<string> | string, properties?: object) : Builder<T> {
        this.addStatement(StatementPrefix.MERGE)

        this.currentStatement().match(alias, labels, this.aliasProperties(alias, properties) )

        return this
    }

    relationship(type: string | string[], direction?: Direction, alias?: string | null, properties?: object | undefined,  degrees?: number | string) : Builder<T> {
        const props = Object.entries(properties || {})
            .map(([key, value]) => new Property(key, this.aliasProperty(null, key, value).getParam()))


        this.currentStatement().relationship(type, direction, alias, props, degrees)

        return this;
    }

    to(alias?: string | undefined, labels?: Array<string> | string, properties?: object | undefined) : Builder<T> {
        const props = Object.entries(properties || {})
            .map(([key, value]) => new Property(key, this.aliasProperty(null, key, value).getParam()))

        this.currentStatement().match(alias, labels, props )

        return this
    }

    onCreateSet(key: string, value: any) : Builder<T> {
        this.currentStatement().onCreateSet(key, this.aliasProperty(null, key, value).getParam())

        return this
    }

    onMatchSet(key: string, value: any) : Builder<T> {
        this.currentStatement().onMatchSet(key, this.aliasProperty(null, key, value).getParam())

        return this
    }

    set(key: string, value: any) : Builder<T> {
        this.currentStatement().set(key, this.aliasProperty(null, key, value).getParam())

        return this
    }

    remove(...values: string[]) {
        this.currentStatement().remove(...values)

        return this
    }

    setAppend(key: string, value: object) : Builder<T> {
        this.currentStatement().setAppend(key, this.aliasProperty(null, key, value).getParam())

        return this
    }

    where(key: string | WhereStatement | object, value?: any | undefined) : Builder<T> {
        if ( key instanceof WhereStatement ) {
            this.currentStatement().where(key)
        }
        else if ( typeof key === 'object' ) {
            Object.entries(key)
                .map(([ key, value ]) => {
                    this.currentStatement().where( key, this.aliasProperty(null, key, value).getParam());
                })
        }
        else {
            this.currentStatement().where( key, this.aliasProperty(null, key, value).getParam());
        }

        return this
    }

    whereNot(key: string | object, value?: any | undefined) : Builder<T> {
        if ( typeof key === 'object' ) {
            Object.entries(key)
                .map(([ key, value ]) => {
                    this.currentStatement().whereNot( key, this.aliasProperty(null, key, value).getParam());
                })
        }
        else {
            this.currentStatement().whereNot( key, this.aliasProperty(null, key, value).getParam());
        }

        return this
    }

    whereId(alias: string, id: number) : Builder<T> {
        this.currentStatement().whereId(alias, this.aliasProperty(alias, '_id', int(id)).getParam())

        return this
    }

    whereNotId(alias: string, id: number) : Builder<T> {
        this.currentStatement().whereNotId(alias, this.aliasProperty(alias, '_id', int(id)).getParam())

        return this
    }

    whereRaw(predicate: string) : Builder<T> {
        this.currentStatement().whereRaw(predicate)

        return this
    }

    whereLike(key: string, value: any) : Builder<T> {
        this.currentStatement().whereLike(key, this.aliasProperty(null, key, value).getParam())

        return this
    }

    whereNotLike(key: string, value: any) : Builder<T> {
        this.currentStatement().whereNotLike(key, this.aliasProperty(null, key, value).getParam())

        return this
    }

    whereStartsWith(key: string, value: any) : Builder<T> {
        this.currentStatement().whereStartsWith(key, this.aliasProperty(null, key, value).getParam())

        return this
    }

    whereNotStartsWith(key: string, value: any) : Builder<T> {
        this.currentStatement().whereNotStartsWith(key, this.aliasProperty(null, key, value).getParam())

        return this
    }

    whereEndsWith(key: string, value: any) : Builder<T> {
        this.currentStatement().whereEndsWith(key, this.aliasProperty(null, key, value).getParam())

        return this
    }

    whereNotEndsWith(key: string, value: any) : Builder<T> {
        this.currentStatement().whereNotEndsWith(key, this.aliasProperty(null, key, value).getParam())

        return this
    }

    whereContains(key: string, value: any) : Builder<T> {
        this.currentStatement().whereContains(key, this.aliasProperty(null, key, value).getParam())

        return this
    }

    whereNotContains(key: string, value: any) : Builder<T> {
        this.currentStatement().whereNotContains(key, this.aliasProperty(null, key, value).getParam())

        return this
    }

    whereGreaterThan(key: string, value: any) : Builder<T> {
        this.currentStatement().whereGreaterThan(key, this.aliasProperty(null, key, value).getParam())

        return this
    }

    whereGreaterThanOrEqual(key: string, value: any) : Builder<T> {
        this.currentStatement().whereGreaterThanOrEqual(key, this.aliasProperty(null, key, value).getParam())

        return this
    }

    whereLessThan(key: string, value: any) : Builder<T> {
        this.currentStatement().whereLessThan(key, this.aliasProperty(null, key, value).getParam())

        return this
    }

    whereLessThanOrEqual(key: string, value: any) : Builder<T> {
        this.currentStatement().whereLessThanOrEqual(key, this.aliasProperty(null, key, value).getParam())

        return this
    }

    whereBetween(key: string, floor: any, ceiling: any) : Builder<T> {
        this.currentStatement().whereBetween(key, this.aliasProperty(null, key, floor).getParam(), this.aliasProperty(null, key, ceiling).getParam())

        return this
    }

    delete(...items: string[]) : Builder<T> {
        this.currentStatement().delete(...items)

        return this
    }

    detachDelete(...items: string[]) : Builder<T> {
        this.currentStatement().detachDelete(...items)

        return this
    }


    orderBy(key: string, order: Order = Order.ASC) : Builder<T> {
        this.currentStatement().orderBy(key, order)

        return this
    }

    or(key: string | object, value?: any | undefined) : Builder<T> {
        this.addWhereStatement(Condition.OR)

        this.where(key, value)

        return this
    }

    skip(skip: number) : Builder<T> {
        this.currentStatement().skip(skip)

        return this
    }

    limit(limit: number) : Builder<T> {
        this.currentStatement().limit(limit)

        return this
    }

    return(...values: Array<string>) : Builder<T> {
        this.currentStatement().return(...values);

        return this
    }

    with(...items: string[]) : Builder<T> {
        this.addStatement(StatementPrefix.WITH)

        this.currentStatement().with(items);

        return this
    }

    foreach(identifier: string, collection: any[], query: Builder<T>): Builder<T> {
        const param = this.aliasProperty(null, identifier, collection).getParam()

        this.currentStatement().foreach(identifier, param, query)

        return this
    }

    getParams() : Params {
        return this.params;
    }

    build() : BuiltCypher {
        return {
            cypher: this.toString(),
            params: this.params,
        }
    }

    raw(value: any): Raw {
        return new Raw(value)
    }

    toString() : string {
        return this.statements.map(statement => statement.toString())
            .join('\n')
    }

    private aliasProperty(alias: string | null, key: string, value: any) : Property {
        if ( value instanceof Raw ) {
            return new Property(key, value as Raw)
        }

        // Create a safe param name
        let param = [alias, key].filter(e => !!e).join('_')
            .replace(/[^a-z0-9_]+/i, '_')

        // Increment param if it already exists
        if ( this.params.hasOwnProperty(param) ) {
            let originalParam = param
            let key = 1

            while ( this.params.hasOwnProperty(param) ) {
                key++;

                param = originalParam + key
            }
        }

        // Convert it to an int?
        if ( Number.isInteger(value) ) value = int(value)

        // Set in params
        this.params[ param ] = value

        return new Property(key, param)
    }

    private currentStatement() : Statement<T> {
        return this.statements[ this.statements.length - 1 ]
    }

    private aliasProperties(alias: string, properties: object | undefined): Array<Property> {
        return Object.entries(properties || {}).map(([key, value]): Property => this.aliasProperty(alias, key, value))
    }

    private addStatement(prefix: StatementPrefix = StatementPrefix.MATCH) : void {
        this.statements.push(new Statement(prefix))
    }

    private addWhereStatement(condition: Condition = Condition.WHERE) {
        this.currentStatement().predicates.push( new WhereStatement(condition) )
    }

}

interface BuiltCypher {
    cypher: string;
    params: object;
}