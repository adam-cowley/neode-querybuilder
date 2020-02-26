import Property from '../property'

export default class MatchStatement<T> {

    private alias: string | undefined;

    private model?:  Array<string> | string;

    private properties?: Array<Property> | undefined;

    constructor(alias: string | undefined, model?: Array<string> | string | undefined, properties?: Array<Property> ) {
        this.alias = alias
        this.model = model
        this.properties = properties
    }

    toString() : string {
        let output: string = `(${this.alias || ''}`;

        if ( Array.isArray(this.model) ) {
            output += `:${this.model.join(':')}`
        }
        else if ( this.model !== undefined ) {
           output += `:${this.model}`
        }

        if ( this.properties !== undefined && this.properties.length ) {
            output += ` {`
            output += this.properties.map(prop => prop.toInlineString()).join(', ')
            output += `}` 
        }
        
        return output + ')';
    }
}