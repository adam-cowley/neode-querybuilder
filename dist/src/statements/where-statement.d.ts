import { Operator, Condition, Prefix } from '../constants';
export default class WhereStatement {
    private condition;
    private predicates;
    constructor(condition?: Condition);
    get length(): number;
    where(alias: WhereStatement | string, param?: string, operator?: Operator, prefix?: Prefix, negative?: boolean): WhereStatement;
    whereNot(alias: string, param: string, prefix?: Prefix): WhereStatement;
    whereId(alias: string, param: string, prefix?: Prefix): WhereStatement;
    whereNotId(alias: string, param: string, prefix?: Prefix): WhereStatement;
    whereRaw(predicate: string, prefix?: Prefix): WhereStatement;
    whereBetween(alias: string, floor: string, ceiling: string): WhereStatement;
    whereLike(key: string, param: string): WhereStatement;
    whereNotLike(key: string, param: string): WhereStatement;
    whereStartsWith(key: string, param: string): WhereStatement;
    whereNotStartsWith(key: string, param: string): WhereStatement;
    whereEndsWith(key: string, param: string): WhereStatement;
    whereNotEndsWith(key: string, param: string): WhereStatement;
    whereContains(key: string, param: string): WhereStatement;
    whereNotContains(key: string, param: string): WhereStatement;
    whereGreaterThan(key: string, param: string): WhereStatement;
    whereGreaterThanOrEqual(key: string, param: string): WhereStatement;
    whereLessThan(key: string, param: string): WhereStatement;
    whereLessThanOrEqual(key: string, param: string): WhereStatement;
    or(alias: string, param: string, operator?: Operator): WhereStatement;
    toString(): string;
}
