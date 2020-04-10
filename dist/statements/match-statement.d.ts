import Property from '../property';
export default class MatchStatement<T> {
    private alias;
    private model?;
    private properties?;
    constructor(alias: string | undefined, model?: Array<string> | string | undefined, properties?: Array<Property>);
    toString(): string;
}
