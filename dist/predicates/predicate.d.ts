import { Prefix, Operator } from '../constants';
export default class Predicate {
    protected alias: string;
    protected prefix: Prefix;
    protected param?: string;
    protected operator: Operator;
    protected negative: boolean;
    constructor(alias: string, param?: string, operator?: Operator, prefix?: Prefix);
    setNegative(): Predicate;
    toString(prefix?: boolean): string;
}
