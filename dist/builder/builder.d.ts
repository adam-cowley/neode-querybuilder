import Statement from '../statements/statement';
import WhereStatement from '../statements/where-statement';
import { Order, Direction } from '../constants';
interface Params {
    [key: string]: any;
}
export default class Builder<T> {
    params: Params;
    statements: Array<Statement<T>>;
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
    private aliasProperty;
    private currentStatement;
    private aliasProperties;
    private addStatement;
    private addWhereStatement;
}
interface BuiltCypher {
    cypher: string;
    params: object;
}
export {};
