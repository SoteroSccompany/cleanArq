import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import FindCustomerUseCase from "./find.customer.usecase";


describe("Test find customer use case", () => {

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

    it("Should find a customer", async () => {

        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "City 1", "state1", "30770400");
        customer.changeAddress(address);

        const customerRepository = new CustomerRepository();
        const usecase = new FindCustomerUseCase(customerRepository);

        await customerRepository.create(customer);

        const input = {
            id: "123"
        }

        const output = {
            id: "123",
            name: "Customer 1",
            address: {
                street: "Street 1",
                city: "City 1",
                number: 123,
                zip: "30770400"
            }
        }

        const result = await usecase.execute(input);

        expect(result).toStrictEqual(output);



    })


});