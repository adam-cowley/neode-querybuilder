import { Prefix } from '../constants';
export default class WhereRaw {
    private prefix;
    private predicate;
    constructor(predicate: string, prefix?: Prefix);
    toString(prefix?: boolean): string;
}
