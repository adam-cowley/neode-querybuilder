import { Operator } from './constants'
import Raw from './raw';

export default class Property {
    private key: string;
    private param: string | Raw | null;
    private operator: Operator;

    constructor(key: string, param: string | Raw | null, operator: Operator = Operator.EQUALS) {
        this.key = key
        this.param = param
        this.operator = operator;
    }

    getParam() : string {
        return this.param as string;
    }

    public convertParam(): string {
        if ( this.param instanceof Raw ) return this.param.toString()
        else if ( !this.param ) return 'null'

        return `$${this.param}`
    }

    toInlineString() {
        return `${this.key}: ${this.convertParam()}`
    }

    toString(): string {
        return `${this.key} ${this.operator} ${this.convertParam()}`
    }
}