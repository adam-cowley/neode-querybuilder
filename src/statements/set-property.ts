import { SetOperator } from '../constants';
import Raw from '../raw';

export default class SetProperty {

    private key: string;

    private param: string | Raw;

    private operator: SetOperator;

    constructor(key: string, param: string | Raw, operator: SetOperator = SetOperator.EQUALS) {
        this.key = key
        this.param = param
        this.operator = operator
    }

    toString() {
        const value = this.param instanceof Raw ? this.param.toString() : `$${this.param}`
        return `${this.key} ${this.operator} ${value}`
    }

}