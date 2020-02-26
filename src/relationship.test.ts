import Relationship from "./relationship"
import { Direction } from "./constants"
import Property from "./property"

describe('Relationship', () => {

    it('should build a relationship with a type', () => {
        const relationship = new Relationship('TYPE')

        expect(relationship.toString()).toBe('-[:TYPE]-')
    })

    it('should build a relationship with a type and direction', () => {
        const relationship = new Relationship('TYPE', Direction.INCOMING)

        expect(relationship.toString()).toBe('<-[:TYPE]-')
    })

    it('should build a relationship with a type and direction', () => {
        const properties: Property[] = [
            new Property('key1', 'param1'),
            new Property('key2', 'param2'),
        ]

        const relationship = new Relationship('TYPE', Direction.OUTGOING, null, properties)

        expect(relationship.toString()).toBe('-[:TYPE {key1: $param1, key2: $param2}]->')
    })

    it('should build a relationship with a type and direction', () => {
        const properties: Property[] = [
            new Property('key1', 'param1'),
            new Property('key2', 'param2'),
        ]

        const relationship = new Relationship('TYPE', Direction.BOTH, 'alias', properties)

        expect(relationship.toString()).toBe('-[alias:TYPE {key1: $param1, key2: $param2}]-')
    })

    it('should build a variable length relationship as a number', () => {
        const relationship = new Relationship('TYPE', Direction.BOTH, 'alias', [], 2)

        expect(relationship.toString()).toBe('-[alias:TYPE*2]-')
    })

    it('should build a variable length relationship', () => {
        const relationship = new Relationship('TYPE', Direction.BOTH, 'alias', [], '2..3')

        expect(relationship.toString()).toBe('-[alias:TYPE*2..3]-')
    })

    it('should build a variable length relationship using setDegrees', () => {
        const rel = new Relationship('TYPE')
        rel.setDegrees(3)

        expect( rel.toString() ).toBe(`-[:TYPE*3]-`)
    })


})