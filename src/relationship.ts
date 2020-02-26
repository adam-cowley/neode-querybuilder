import { Direction } from "./constants";
import Property from "./property";

export default class Relationship {

    private type: string | string[];

    private direction: Direction;

    private alias? : string | null | undefined;

    private properties: Property[] = [];
    
    private degrees?: number | string;

    constructor(type: string | string[], direction: Direction = Direction.BOTH, alias: string | null | undefined = undefined, properties: Property[] = [], degrees: number | string | undefined = undefined) {
        this.type = type
        this.direction = direction
        this.alias = alias
        this.properties = properties
        this.degrees = degrees
    }

    setDegrees(degrees: number | string) : Relationship {
        this.degrees = degrees

        return this
    }

    toString() {
        let type = ''

        if ( Array.isArray(this.type) ) {
            type = this.type.join('|')
        }
        else if ( this.type !== undefined ) {
            type = this.type
        }

        return [
            this.direction === Direction.INCOMING ? '<' : '',
            '-[',
            this.alias !== undefined ? this.alias : '',
            ':',
            type,

            this.properties.length ? ` {${this.properties.map(property => property.toInlineString()).join(', ')}}` : '',

            this.degrees !== undefined ? `*${this.degrees}` : '',
            ']-',
            this.direction === Direction.OUTGOING ? '>' : '',
        ].join('')
    }


}
