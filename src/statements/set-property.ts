import { SetOperator } from '../constants';

export default class SetProperty {

    private key: string;

    private param: string;

    private operator: SetOperator;

    constructor(key: string, param: string, operator: SetOperator = SetOperator.EQUALS) {
        this.key = key
        this.param = param
        this.operator = operator
    }

    toString() {
        return `${this.key} ${this.operator} $${this.param}`
    }

}