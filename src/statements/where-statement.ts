import Predicate from '../predicates/predicate'
import WhereRaw from '../predicates/where-raw';
import WhereId from '../predicates/where-id'

import  { Operator, Condition, Prefix, } from '../constants'
import WhereBetween from '../predicates/where-between';


export default class WhereStatement {

    private condition: Condition;

    private predicates: Array<WhereStatement | Predicate | WhereBetween | WhereRaw> = [];

    constructor(condition: Condition = Condition.DEFAULT) {
        this.condition = condition
    }

    get length() : number {
        return this.predicates.length
    }

    where(alias: WhereStatement | string, param?: string, operator?: Operator, prefix?: Prefix, negative: boolean = false) : WhereStatement {
        if ( alias instanceof WhereStatement ) {
            this.predicates.push( alias )
        }
        else {
            const predicate = new Predicate(alias, param, operator, prefix);

            if ( negative ) predicate.setNegative()

            this.predicates.push( predicate )
        }

        return this
    }

    whereNot(alias: string, param: string, prefix?: Prefix) : WhereStatement {
        this.predicates.push( new Predicate(alias, param, Operator.EQUALS, prefix).setNegative() )

        return this
    }
    
    whereId(alias: string, param: string, prefix?: Prefix) : WhereStatement {
        this.predicates.push( new WhereId(alias, param, Operator.EQUALS, prefix) )

        return this
    }
    
    whereNotId(alias: string, param: string, prefix?: Prefix) : WhereStatement {
        this.predicates.push( new WhereId(alias, param, Operator.EQUALS, prefix).setNegative() )

        return this
    }

    whereRaw(predicate: string, prefix?: Prefix) : WhereStatement {
        this.predicates.push( new WhereRaw(predicate, prefix) )

        return this
    }

    whereBetween(alias: string, floor: string, ceiling: string) : WhereStatement {
        this.predicates.push( new WhereBetween(alias, floor, ceiling) )

        return this
    }

    or(alias: string, param: string, operator?: Operator) : WhereStatement {
        this.predicates.push( new Predicate(alias, param, operator, Prefix.OR) )

        return this
    }

    toString() : string {
        return `${this.condition}(${this.predicates.map((predicate, index) => predicate.toString(index > 0)).join(' ')})`
    }

}