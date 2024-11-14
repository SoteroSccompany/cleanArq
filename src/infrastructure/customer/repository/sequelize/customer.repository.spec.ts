import { Sequelize } from "sequelize-typescript";
import CustomerModel from "./customer.model";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import CustomerRepository from "./customer.repository";

describe("Customer Repository unit test", () => {

    let sequileze: Sequelize;

    beforeEach(async () => {
        sequileze = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        })

        sequileze.addModels([CustomerModel]);
        await sequileze.sync();
    });

    afterEach(async () => {
        await sequileze.close();
    });

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "City 1", "state1", "30770400");
        customer.Address = address;
        await customerRepository.create(customer);
        const customerModel = await CustomerModel.findOne({ where: { id: "123" } });
        expect(customerModel.toJSON()).toStrictEqual({
            id: "123",
            name: customer.name,
            street: address.street,
            number: address.number,
            zipcode: address.zipcode,
            city: address.city,
            state: address.state,
            active: customer.isActive(),
            rewardPoints: customer.points
        })
    });

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "City 1", "state1", "30770400");
        customer.Address = address;
        await customerRepository.create(customer);
        customer.changeName("Customer 2");
        customer.activate();
        customer.addRewardPoints(100);
        await customerRepository.update(customer);
        const customerModel = await CustomerModel.findOne({ where: { id: "123" } });
        expect(customerModel.toJSON()).toStrictEqual({
            id: "123",
            name: "Customer 2",
            street: address.street,
            number: address.number,
            zipcode: address.zipcode,
            city: address.city,
            state: address.state,
            active: true,
            rewardPoints: 100
        })
    })

    it("should find a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "City 1", "state1", "30770400");
        customer.Address = address;
        await customerRepository.create(customer);
        const customerModel = await CustomerModel.findOne({ where: { id: "123" } });
        const customerFound = await customerRepository.find("123");
        expect(customerModel.toJSON()).toStrictEqual({
            id: customerFound.id,
            name: customerFound.name,
            street: customerFound.Address.street,
            number: customerFound.Address.number,
            zipcode: customerFound.Address.zipcode,
            city: customerFound.Address.city,
            state: customerFound.Address.state,
            active: customerFound.isActive(),
            rewardPoints: customerFound.points
        })
    });




    it("should find all customers", async () => {
        const customerRepository = new CustomerRepository();
        const customer1 = new Customer("123", "Customer 1");
        const address1 = new Address("Street 1", 123, "City 1", "state1", "30770400");
        customer1.Address = address1;
        await customerRepository.create(customer1);
        const customer2 = new Customer("456", "Customer 2");
        const address2 = new Address("Street 2", 456, "City 2", "state2", "30770400");
        customer2.Address = address2;
        await customerRepository.create(customer2);
        const customersRepository = await customerRepository.findAll();
        const customers = [customer1, customer2];
        expect(customersRepository).toStrictEqual(customers);
    });






})