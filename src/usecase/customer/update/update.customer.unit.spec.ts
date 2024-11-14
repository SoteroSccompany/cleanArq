import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import CustomerUpdateUseCase from "./update.customer.usecase";


const customer = CustomerFactory.createWithAddress(
    "John Doe",
    new Address("Street 1", 123, "City 1", "state1", "30770400")
);

const input = {
    id: customer.id,
    name: "Gabriel",
    address: {
        street: "Street 2",
        number: 321,
        city: "City 2",
        state: "state2",
        zip: "30770401"
    }
}

const MockRepository = () => {
    return {
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(customer)), // Aqui busca e resolve com o customer
        create: jest.fn(),
        update: jest.fn(),
    }
};

describe("Unit test for customer update use case ", () => {

    it("Should update a customer", async () => {

        const customerRepository = MockRepository();
        const customerUpdateUseCase = new CustomerUpdateUseCase(customerRepository);

        const output = await customerUpdateUseCase.execute(input);

        expect(output).toStrictEqual(input);

    });

    it("Should throw error when customer not found", async () => {
        const customerRepository = MockRepository();
        customerRepository.find = jest.fn().mockReturnValue(Promise.resolve(null)); // Aqui busca e resolve com null
        const customerUpdateUseCase = new CustomerUpdateUseCase(customerRepository);
        await expect(customerUpdateUseCase.execute(input)).rejects.toThrow("Customer not found");
    });



});


