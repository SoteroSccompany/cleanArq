import Address from "../../customer/value-object/address";
import Customer from "../../customer/entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderService from "./order.service";

describe("Order service unit test", () => {

    it("should place on order", () => {

        const customer = new Customer("c1", "customer 1");
        const address = new Address("street1", 498, "city1", "state1", "30770400");
        customer.Address = address;
        customer.activate();
        const item = new OrderItem("i1", "item 1", 100, "p1", 1);

        const order = OrderService.placeOrder(customer, [item]);

        expect(customer.points).toBe(50);
        expect(order.total()).toBe(100);

    })

    it("should get total of all order", () => {

        const item1 = new OrderItem("i1", "item i", 100, "p1", 1);
        const item2 = new OrderItem("i2", "item i2", 200, "p2", 2);

        const order = new Order("o1", "c1", [item1]);
        const order2 = new Order("o2", "c1", [item2]);

        const total = OrderService.total([order, order2]);

        expect(total).toBe(500);
    });

    it("should changeCustomer of a order", () => {
        const customer = new Customer("c1", "customer 1");
        const address = new Address("street1", 498, "city1", "state1", "30770400");
        customer.Address = address;
        customer.activate();
        const item = new OrderItem("i1", "item 1", 100, "p1", 1);
        const customer2 = new Customer("c2", "customer 2");
        const address2 = new Address("street2", 498, "city2", "state2", "30770400");
        customer2.Address = address2;
        customer2.activate();
        const order = OrderService.placeOrder(customer, [item]);
        OrderService.changeCustomer(customer2, order);
        expect(order.customerId).toBe("c2");
    });

});