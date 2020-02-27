import CallStatement from "./call-statement"


describe('CallStatement', () => {
    const statement = new CallStatement('fn', [1, 2, 3])

    it('should wrap a string in double quotes', () => {
        expect(statement.parameterToString('test')).toEqual('"test"')
    })

    it('should escape a string with double quotes', () => {
        expect(statement.parameterToString('"test"')).toEqual('"\"test\""')
    })

    it('should convert an array to a string', () => {
        expect(statement.parameterToString([1,2,3])).toEqual("[1, 2, 3]")
    })

    it('should convert an object to a string', () => {
        expect(statement.parameterToString({ boolean: true, number: 10, string: 'string' })).toEqual('{boolean: true, number: 10, string: "string"}')
    })
})