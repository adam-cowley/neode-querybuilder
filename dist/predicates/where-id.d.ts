import Predicate from './predicate';
import { Prefix, Operator } from '../constants';
export default class WhereId extends Predicate {
    constructor(alias: string, param: string, operator?: Operator, prefix?: Prefix);
}
