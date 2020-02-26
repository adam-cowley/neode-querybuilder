import { Prefix } from '../constants';

export default class WhereRaw {

    private prefix: Prefix;
    private predicate : string;

    constructor(predicate: string, prefix: Prefix = Prefix.DEFAULT) {
        this.predicate = predicate
        this.prefix = prefix
    }

    toString(prefix: boolean = false) {
        return `${prefix ? this.prefix : ''}${this.predicate}`
    }



}