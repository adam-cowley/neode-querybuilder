import { Order } from "../constants";

export default class OrderBy {

    private key: string;

    private order: Order;

    constructor(key: string, order: Order) {
        this.key = key
        this.order = order
    }

    toString() {
        return `${this.key} ${this.order}`
    }

}