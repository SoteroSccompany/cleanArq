import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import FindCustomerUseCase from "./find.customer.usecase";


const customer = new Customer("123", "Customer 1");
const address = new Address("Street 1", 123, "City 1", "state1", "30770400");
customer.changeAddress(address);


const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe("Unit test fund customer use case", () => {



    it("Should find a customer", async () => {

        const customerRepository = MockRepository();
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

    it("Shoud not find a customer", async () => {
        const customerRepository = MockRepository();
        customerRepository.find.mockImplementation(() => {
            throw new Error("Customer not found");
        });
        const usecase = new FindCustomerUseCase(customerRepository);

        await customerRepository.create(customer);

        const input = {
            id: "123"
        }

        expect(() => {
            return usecase.execute(input);
        }).rejects.toThrow("Customer not found");



    })


});