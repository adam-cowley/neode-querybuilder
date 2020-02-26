import { Prefix, Operator } from '../constants'


export default class Predicate {

    protected alias: string;

    protected prefix: Prefix;

    protected param?: string;

    protected operator: Operator;

    protected negative: boolean = false;

    constructor(alias: string, param?: string, operator: Operator = Operator.EQUALS, prefix: Prefix = Prefix.DEFAULT) {
        this.alias = alias
        this.param = param
        this.operator = operator
        this.prefix = prefix;
    }

    setNegative() : Predicate {
        this.negative = true

        return this
    }

    toString(prefix: boolean = false) : string {
        const negative = this.negative ? 'NOT ' : ''

        return `${prefix ? this.prefix : ''}${negative}${this.alias} ${this.operator} $${this.param}`
    }
}