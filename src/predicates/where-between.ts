import Predicate from './predicate';
import { Prefix, Operator } from '../constants'

export default class WhereBetween {

    private alias: string;

    private floor: string;

    private ceiling: string;

    constructor(alias: string, floor: string, ceiling: string) {
        this.alias = alias
        this.floor = floor
        this.ceiling = ceiling
    }

    toString() {
        return `${this.alias} BETWEEN $${this.floor} AND $${this.ceiling}`
    }

}