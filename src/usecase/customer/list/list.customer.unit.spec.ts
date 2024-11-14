import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import ListCustomerUseCase from "./list.customer.usecase";


const customer1 = CustomerFactory.createWithAddress(
    "Customer 1",
    new Address("Street 1", 1, "City 1", "State 1", "Zip 1")
)

const customer2 = CustomerFactory.createWithAddress(
    "Customer 2",
    new Address("Street 2", 2, "City 2", "State 2", "Zip 2")
)

const MockCustomerRepository = () => {
    return {
        create: jest.fn(),
        update: jest.fn(),
        findAll: jest.fn().mockResolvedValue(Promise.resolve([customer1, customer2])),
        find: jest.fn(),
    }
}

describe("Unit test for listing customer use case", () => {

    it("Should list a customer", async () => {

        const repository = MockCustomerRepository();
        const useCase = new ListCustomerUseCase(repository);

        const input = {};
        const output = await useCase.execute(input);

        expect(output.customers.length).toBe(2);
        expect(output.customers[0].name).toBe("Customer 1");
        expect(output.customers[0].address.street).toBe("Street 1");
        expect(output.customers[0].address.number).toBe(1);
        expect(output.customers[0].address.city).toBe("City 1");
        expect(output.customers[0].address.state).toBe("State 1");
        expect(output.customers[0].address.zip).toBe("Zip 1");
        expect(output.customers[1].name).toBe("Customer 2");
        expect(output.customers[1].address.street).toBe("Street 2");
        expect(output.customers[1].address.number).toBe(2);
        expect(output.customers[1].address.city).toBe("City 2");
        expect(output.customers[1].address.state).toBe("State 2");
        expect(output.customers[1].address.zip).toBe("Zip 2");
    });

    it("Should throw an error when listing a customer", async () => {

        const repository = MockCustomerRepository();
        repository.findAll = jest.fn().mockRejectedValue(new Error("Error listing customer"));
        const useCase = new ListCustomerUseCase(repository);

        const input = {};
        await expect(useCase.execute(input)).rejects.toThrow("Error listing customer");
    });


});