import { Operator } from './constants';
export default class Property {
    private key;
    private param;
    private operator;
    constructor(key: string, param: string | null, operator?: Operator);
    getParam(): string;
    convertParam(): string;
    toInlineString(): string;
    toString(): string;
}
