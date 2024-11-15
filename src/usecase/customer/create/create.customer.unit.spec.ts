import CustomerCreateUseCase from "./create.customer.usecase";

const input = {
    name: "John Doe",
    address: {
        street: "Main Street",
        state: "New York",
        city: "New York",
        number: 123,
        zip: "12345"
    }
}


const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
};

describe("Unit test create customer use case", () => {

    it("Should create a customer ", async () => {

        const customerRepository = MockRepository();
        const customerCreateUseCase = new CustomerCreateUseCase(customerRepository);

        const output = await customerCreateUseCase.execute(input);

        expect(output).toStrictEqual({
            id: expect.any(String),
            name: input.name,
            address: {
                street: input.address.street,
                city: input.address.city,
                number: input.address.number,
                state: input.address.state,
                zip: input.address.zip
            }
        });


    });

    it("Should throw an error when name is missing", async () => {
        const customerRepository = MockRepository();
        const customerCreateUseCase = new CustomerCreateUseCase(customerRepository);

        input.name = "";

        await expect(customerCreateUseCase.execute(input)).rejects.toThrow("Name is required");

    });


    it("Should throw an error when street is missing", async () => {
        const customerRepository = MockRepository();
        const customerCreateUseCase = new CustomerCreateUseCase(customerRepository);

        input.address.street = "";

        await expect(customerCreateUseCase.execute(input)).rejects.toThrow('Street is required');

    });

})

