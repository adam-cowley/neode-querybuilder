import { Order } from "../constants";
export default class OrderBy {
    private key;
    private order;
    constructor(key: string, order: Order);
    toString(): string;
}
