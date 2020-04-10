import { SetOperator } from '../constants';
export default class SetProperty {
    private key;
    private param;
    private operator;
    constructor(key: string, param: string, operator?: SetOperator);
    toString(): string;
}
