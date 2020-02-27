export default class CallStatement {
    private fn;
    private parameters;
    constructor(fn: string, parameters: any[]);
    parameterToString(param: any): string;
    toString(): string;
}
