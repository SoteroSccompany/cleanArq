import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import Product from "../../../../domain/product/entity/product";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Order from "../../../../domain/checkout/entity/order";
import OrderService from "../../../../domain/checkout/service/order.service";
import OrderRepository from "../../../order/repository/sequelize/order.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

describe("Order Repository unit test", () => {

    let sequileze: Sequelize;

    beforeEach(async () => {
        sequileze = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        })

        sequileze.addModels([OrderModel, OrderItemModel, CustomerModel, ProductModel]);
        await sequileze.sync();
    });

    afterEach(async () => {
        await sequileze.close();
    });

    it("should create an order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "City 1", "state1", "30770400");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("123", product.name, product.price, product.id, 2);

        const order = new Order("123", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: product.id
                }
            ]
        })
    });

    it("should update an order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "City 1", "state1", "30770400");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const customer2 = new Customer("456", "Customer 2");
        const address2 = new Address("Street 2", 456, "City 2", "state2", "30770400");
        customer2.changeAddress(address2);
        customer2.activate();
        await customerRepository.create(customer2);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("123", product.name, product.price, product.id, 2);
        const order = new Order("123", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);


        OrderService.changeCustomer(customer2, order);
        await orderRepository.update(order);

        const orderModelUpdated = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        });

        expect(orderModelUpdated.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "456",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: product.id
                }
            ]
        })
    });

    it("shound find an order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "City 1", "state1", "30770400");
        customer.changeAddress(address);
        customer.activate();
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("123", product.name, product.price, product.id, 2);
        const order = new Order("123", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        });
        const orderFound = await orderRepository.find(order.id);

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: product.id
                }
            ]
        });

        expect(orderFound.id).toBe(order.id);

    })

    it("shound find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "City 1", "state1", "30770400");
        customer.changeAddress(address);
        customer.activate();
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);


        const orderRepository = new OrderRepository();

        const orderItem = new OrderItem("123", product.name, product.price, product.id, 2);//200
        const order = new Order("123", customer.id, [orderItem]);
        await orderRepository.create(order);

        const orderItem2 = new OrderItem("654", product.name, product.price, product.id, 2);//200
        const order2 = new Order("654", customer.id, [orderItem2]);
        await orderRepository.create(order2);

        const orders = await orderRepository.findAll();

        expect(orders).toStrictEqual([order, order2]);




    })

    it("should update an items", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "City 1", "state1", "30770400");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("123", product.name, product.price, product.id, 2);//200
        const orderItem2 = new OrderItem("456", product.name, product.price, product.id, 1);//100
        const order = new Order("123", customer.id, [orderItem, orderItem2]);//300

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);


        orderItem.changeQuantity(3);//300
        orderItem2.changeQuantity(2);//200
        await orderRepository.updateItems(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: product.id
                },
                {
                    id: orderItem2.id,
                    name: orderItem2.name,
                    price: orderItem2.price,
                    quantity: orderItem2.quantity,
                    order_id: "123",
                    product_id: product.id
                }
            ]
        })

    });

    it("should throw error on update an items", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "City 1", "state1", "30770400");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("123", product.name, product.price, product.id, 2);//200
        const orderItem2 = new OrderItem("456", product.name, product.price, product.id, 1);//100
        const order = new Order("123", customer.id, [orderItem, orderItem2]);//300

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        expect(async () => {
            await orderRepository.updateItems(order);
        }).rejects.toThrow(`Error to update a order item`);

    });

    it("should find a order by id", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "City 1", "state1", "30770400");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("123", product.name, product.price, product.id, 2);//200
        const orderItem2 = new OrderItem("456", product.name, product.price, product.id, 1);//100
        const order = new Order("123", customer.id, [orderItem, orderItem2]);//300

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderFound = await orderRepository.findByOrderId(order.id);
        expect(orderFound).toStrictEqual(order);

    });

    it("should throw an error when find a order by id", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "City 1", "state1", "30770400");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("123", product.name, product.price, product.id, 2);//200
        const orderItem2 = new OrderItem("456", product.name, product.price, product.id, 1);//100
        const order = new Order("123", customer.id, [orderItem, orderItem2]);//300

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);


        await expect(async () => {
            await orderRepository.findByOrderId("456");
        }).rejects.toThrow("Order not found");

    });

    it("should throw an error find a order by item id", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "City 1", "state1", "30770400");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("123", product.name, product.price, product.id, 2);//200
        const orderItem2 = new OrderItem("456", product.name, product.price, product.id, 1);//100
        const order = new Order("123", customer.id, [orderItem, orderItem2]);//300

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        await expect(async () => {
            await orderRepository.findByItemId("654");
        }).rejects.toThrow("Order item not found");

    });

    it("should find a order by item id", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "City 1", "state1", "30770400");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("123", product.name, product.price, product.id, 2);//200
        const orderItem2 = new OrderItem("456", product.name, product.price, product.id, 1);//100
        const order = new Order("123", customer.id, [orderItem, orderItem2]);//300

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderFound = await orderRepository.findByItemId(orderItem.id);
        expect(orderFound).toStrictEqual(order);

    });

    it("should throw an error find a orderItem id", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "City 1", "state1", "30770400");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("123", product.name, product.price, product.id, 2);//200
        const orderItem2 = new OrderItem("456", product.name, product.price, product.id, 1);//100
        const order = new Order("123", customer.id, [orderItem, orderItem2]);//300

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        await expect(async () => {
            await orderRepository.findItemByItemId("654");
        }).rejects.toThrow("Order item not found");

    });

    it("should find a orderItem id", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "City 1", "state1", "30770400");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("123", product.name, product.price, product.id, 2);//200
        const orderItem2 = new OrderItem("456", product.name, product.price, product.id, 1);//100
        const order = new Order("123", customer.id, [orderItem, orderItem2]);//300

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderFound = await orderRepository.findItemByItemId(orderItem.id);
        expect(orderFound).toStrictEqual(orderItem);

    });

    it("should throw an error find a ordersItem by order id", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "City 1", "state1", "30770400");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("123", product.name, product.price, product.id, 2);//200
        const orderItem2 = new OrderItem("456", product.name, product.price, product.id, 1);//100
        const order = new Order("123", customer.id, [orderItem, orderItem2]);//300

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        await expect(async () => {
            await orderRepository.findAllItemsByOrderId("654");
        }).rejects.toThrow("Order items not found");

    });

    it("should find a ordersItems by Order id", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "City 1", "state1", "30770400");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("123", product.name, product.price, product.id, 2);//200
        const orderItem2 = new OrderItem("456", product.name, product.price, product.id, 1);//100
        const order = new Order("123", customer.id, [orderItem, orderItem2]);//300

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderFound = await orderRepository.findAllItemsByOrderId(order.id);
        expect(orderFound).toStrictEqual([orderItem, orderItem2]);

    });





})