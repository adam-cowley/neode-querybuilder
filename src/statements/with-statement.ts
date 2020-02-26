export default class WithStatement {

    private values: string[];

    constructor(values: string[]) {
        this.values = values;
    }

    toString() {
        return this.values.join(', ');
    }

}