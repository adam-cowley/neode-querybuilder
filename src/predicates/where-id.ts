import Predicate from './predicate';
import { Prefix, Operator } from '../constants'

export default class WhereId extends Predicate {

    // @ts-ignore
    constructor(alias: string, param: string, operator: Operator = Operator.EQUALS, prefix: Prefix = Prefix.AND) {
        super(alias, param, operator, prefix)

        this.alias = `id(${alias})`
        this.param = param
        this.operator = operator
        this.prefix = prefix
    }

}