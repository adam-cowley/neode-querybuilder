import { Operator } from './constants'

export default class Property {
    private key: string;
    private param: string | null;
    private operator: Operator;

    constructor(key: string, param: string | null, operator: Operator = Operator.EQUALS) {
        this.key = key
        this.param = param
        this.operator = operator;
    }

    getParam() : string {
        return this.param as string;
    }

    public convertParam(): string {
        return this.param ? `$${this.param}` : 'null'
    }

    toInlineString() {
        return `${this.key}: ${this.convertParam()}`
    }

    toString(): string {
        return `${this.key} ${this.operator} ${this.convertParam()}`
    }
}