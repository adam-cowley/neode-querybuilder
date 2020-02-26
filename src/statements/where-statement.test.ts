import WhereStatement from './where-statement'
import { Condition, Operator } from '../constants'

describe('WhereStatement.ts', () => {
    describe('::constructor', () => {
        test('Equals', () => {
            expect(
                (new WhereStatement(Condition.WHERE))
                    .where('this', 'that')
                    .toString()
            ).toEqual('WHERE (this = $that)')

            expect(
                (new WhereStatement(Condition.WHERE))
                    .where('this', 'that', Operator.EQUALS)
                    .toString()
            ).toEqual('WHERE (this = $that)')
        })

        test('Not', () => {
            expect(
                (new WhereStatement(Condition.WHERE))
                    .whereNot('this', 'that')
                    .toString()
            ).toEqual('WHERE (NOT this = $that)')
        })

        test('id(n)', () => {
            expect(
                (new WhereStatement(Condition.WHERE))
                    .whereId('this', 'that')
                    .toString()
            ).toEqual('WHERE (id(this) = $that)')
        })

        test('NOT id(n)', () => {
            expect(
                (new WhereStatement(Condition.WHERE))
                    .whereNotId('this', 'that')
                    .toString()
            ).toEqual('WHERE (NOT id(this) = $that)')
        })

        test('Raw Statements', () => {
            expect(
                (new WhereStatement(Condition.WHERE))
                    .whereRaw('this <> that')
                    .toString()
            ).toEqual('WHERE (this <> that)')
        })

        test('AND', () => {
            expect(
                (new WhereStatement(Condition.WHERE))
                    .where('this', 'that')
                    .where('that', 'this')
                    .toString()
            ).toEqual('WHERE (this = $that AND that = $this)')
        })

        test('OR', () => {
            expect(
                (new WhereStatement(Condition.WHERE))
                    .where('this', 'that')
                    .or('that', 'this')
                    .toString()
            ).toEqual('WHERE (this = $that OR that = $this)')
        })
    })

    describe('Prefix', () => {
        expect(
            (new WhereStatement(Condition.OR))
                .where('this', 'that')
                .or('that', 'this')
                .toString()
        ).toEqual('OR (this = $that OR that = $this)')
    })
})