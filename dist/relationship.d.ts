import { Direction } from "./constants";
import Property from "./property";
export default class Relationship {
    private type;
    private direction;
    private alias?;
    private properties;
    private degrees?;
    constructor(type: string | string[], direction?: Direction, alias?: string | null | undefined, properties?: Property[], degrees?: number | string | undefined);
    setDegrees(degrees: number | string): Relationship;
    toString(): string;
}
