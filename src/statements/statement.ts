import MatchStatement from './match-statement'
import WhereStatement from './where-statement'
import { StatementPrefix, Operator, Prefix, Condition, Order, Direction, SetOperator } from '../constants'
import WithStatement from './with-statement';
import OrderBy from './order-by';
import Relationship from '../relationship';
import Property from '../property';
import SetProperty from './set-property';

export default class Statement<T> {

    private prefix: StatementPrefix;

    private deleteValues: string[] = [];

    private detachDeleteValues: string[] = [];

    private removeValues: string[] = [];

    private onCreateSetValues: SetProperty[] = [];

    private onMatchSetValues: SetProperty[] = [];
    
    private setValues: SetProperty[] = [];

    private returnValues: string[] = [];

    // TODO: replace any
    private pattern: any[] = [];

    public predicates: Array<WhereStatement> = [ new WhereStatement(Condition.WHERE) ];

    public order: OrderBy[] = [];

    private skipRows?: number;

    private limitRows?: number;

    constructor(prefix: StatementPrefix) {
        this.prefix = prefix;
    }

    lastPredicate() : WhereStatement {
        return this.predicates[ this.predicates.length - 1 ]
    }

    with(items: string[]) {
        this.pattern.push( new WithStatement(items) )
    }

    match(alias: string | undefined, labels: any, properties: any) : void {
        this.pattern.push( new MatchStatement(alias, labels, properties) )
    }

    relationship(type: string | string[], direction?: Direction, alias?: string | null, properties?: Property[], degrees?: number | string) : Statement<T> {
        this.pattern.push( new Relationship(type, direction, alias, properties, degrees) )

        return this;
    }

    where(alias: WhereStatement | string, param?: string, operator?: Operator, prefix?: Prefix, negative: boolean = false) : Statement<T> {
        this.lastPredicate().where(alias, param, operator, prefix, negative)
        
        return this
    }

    delete(...values: string[]) : Statement<T>{
        this.deleteValues = this.deleteValues.concat(values)

        return this
    }

    remove(...values: string[]) : Statement<T>{
        this.removeValues = this.removeValues.concat(values)

        return this
    }

    onCreateSet(key: string, param: string) : Statement<T> {
        this.onCreateSetValues.push( new SetProperty(key, param) )
        
        return this
    }

    onMatchSet(key: string, param: string) : Statement<T>  {
        this.onMatchSetValues.push( new SetProperty(key, param) )
        
        return this
    }

    set(key: string, param: string) : Statement<T>  {
        this.setValues.push( new SetProperty(key, param) )
        
        return this
    }

    setAppend(key: string, param: string) : Statement<T> {
        this.setValues.push( new SetProperty(key, param, SetOperator.APPEND_EQUALS) )
        
        return this
    }


    detachDelete(...values: string[]) : Statement<T>{
        this.detachDeleteValues = this.detachDeleteValues.concat(values)

        return this
    }


    whereNot(alias: string, param: string, prefix?: Prefix) : Statement<T> {
        this.lastPredicate().whereNot(alias, param, prefix)

        return this
    }
    
    whereId(alias: string, param: string, prefix?: Prefix) : Statement<T> {
        this.lastPredicate().whereId(alias, param, prefix)

        return this
    }
    
    whereNotId(alias: string, param: string, prefix?: Prefix) : Statement<T> {
        this.lastPredicate().whereNotId(alias, param, prefix)

        return this
    }

    whereRaw(predicate: string, prefix?: Prefix) : Statement<T> {
        this.lastPredicate().whereRaw(predicate, prefix)

        return this
    }

    whereBetween(key: string, floor: string, ceiling: string) : Statement<T> {
        this.lastPredicate().whereBetween(key, floor, ceiling)

        return this
    }

    orderBy(key: string, order: Order = Order.ASC) : Statement<T> {
        this.order.push( new OrderBy(key, order) )

        return this
    }

    return(...values: string[]) : Statement<T> {
        this.returnValues = this.returnValues.concat(values);

        return this
    }

    skip(amount: number) {
        this.skipRows = amount
    }

    limit(amount: number) {
        this.limitRows = amount
    }

    toString() : string {
        const output: string[] = [];

        // Original Pattern
        if ( this.pattern.length ) {
            output.push(
                `${this.prefix} ${this.pattern.map(value => value.toString()).join('')}`
            )
        }

        // Where clauses
        if ( this.predicates.length ) {
            const where = this.predicates
                    .filter(predicate => predicate.length > 0)
                    .map((predicate: WhereStatement) => predicate.toString())
                    .join(`\n`)
            
            if ( where !== '') {
                output.push(where)
            }
        }

        // Remove Values
        if ( this.removeValues.length ) {
            output.push(`REMOVE ${this.removeValues.map(value => value.toString()).join(', ')}`)
        }

        // On Create Set
        if ( this.onCreateSetValues.length ) {
            output.push(`ON CREATE SET ${this.onCreateSetValues.map(value => value.toString()).join(', ')}`)
        }

        // On Match Set
        if ( this.onMatchSetValues.length ) {
            output.push(`ON MATCH SET ${this.onMatchSetValues.map(value => value.toString()).join(', ')}`)
        }

        // Set
        if ( this.setValues.length ) {
            output.push(`SET ${this.setValues.map(value => value.toString()).join(', ')}`)
        }

        // Delete
        if ( this.deleteValues.length ) {
            output.push(`DELETE ${this.deleteValues.map(value => value.toString()).join(', ')}`)
        }

        // Detach Delete
        if ( this.detachDeleteValues.length ) {
            output.push(`DETACH DELETE ${this.detachDeleteValues.map(value => value.toString()).join(', ')}`)
        }

        // Return Statement
        if ( this.returnValues.length ) {
            output.push(`RETURN ${this.returnValues.join(', ')}`)
        }

        // Order
        if ( this.order.length ) {
            output.push(`ORDER BY ${this.order.map(order => order.toString()).join(', ')}`)
        }

        // Skip
        if ( this.skipRows !== undefined ) {
            output.push(`SKIP ${this.skipRows}`)
        }

        // Limit
        if ( this.limitRows !== undefined ) {
            output.push(`LIMIT ${this.skipRows}`)
        }

        return output.join('\n');
    }

}