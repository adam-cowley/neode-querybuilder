import Builder from "../builder/builder";


export default class ForeachStatement<T> {

    constructor(private readonly identifier: string, private readonly collection: string, private readonly query: Builder<T>) {}


    toString() {
        return `FOREACH ( ${this.identifier} IN $${this.collection} | ${this.query.toString()} )`;
    }

}