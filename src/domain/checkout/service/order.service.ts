import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import Customer from "../../customer/entity/customer";
import { v4 as uuid } from 'uuid';

export default class OrderService {

    static placeOrder(customer: Customer, items: OrderItem[]): Order {
        if (items.length === 0) {
            throw new Error('Order must have at least one item');
        }
        const isActive = customer.isActive();
        if (!isActive) {
            throw new Error('Customer is not active');
        }
        const order = new Order(uuid(), customer.id, items);
        const points = order.total() / 2;
        customer.addRewardPoints(points);
        return order;
    }

    static changeCustomer(customer: Customer, order: Order): void {
        if (!customer.isActive()) {
            throw new Error('Customer is not active');
        }
        order.changeCustomer(customer.id);
    }



    static total(orders: Order[]): number {
        return orders.reduce((acc, order) => {
            const total = order.total();
            return acc + total;
        }, 0);
    }

}