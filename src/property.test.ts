import Property from './property'
import { Operator } from './constants'

describe('Property.ts', () => {
    describe('::constructor', () => {
        it('should construct', () => {
            const key = 'key'
            const param = 'param'

            const prop = new Property(key, param, Operator.GREATER_THAN_OR_EQUAL)

            expect(prop.getParam()).toBe(param)
            expect(prop.convertParam()).toBe(`$${param}`)
            expect(prop.toString()).toBe(`${key} >= $${param}`)
        })
    })
})