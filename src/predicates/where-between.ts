import Predicate from './predicate';
import { Prefix, Operator } from '../constants'

export default class WhereBetween extends Predicate {
    private floorPredicate: Predicate;

    private ceilingPredicate: Predicate;

    constructor(alias: string, floor: string, ceiling: string, floorInclusive = true, ceilingInclusive = true, prefix: Prefix = Prefix.DEFAULT) {
        super(alias, undefined, undefined, prefix)
        this.floorPredicate = new Predicate(
            alias,
            floor,
            floorInclusive ? Operator.GREATER_THAN_OR_EQUAL : Operator.GREATER_THAN,
        )
        this.ceilingPredicate = new Predicate(
            alias,
            ceiling,
            ceilingInclusive ? Operator.LESS_THAN_OR_EQUAL : Operator.LESS_THAN,
            Prefix.AND
        )
    }

    private wrapNegative(str: string) {
        if (this.negative) {
            return `NOT (${str})`
        } else {
            return str
        }
    }

    toString(prefix: boolean = false) : string {
        return `${prefix ? this.prefix : ''}${this.wrapNegative(`${this.floorPredicate.toString()} ${this.ceilingPredicate.toString(true)}`)}`;
    }

}