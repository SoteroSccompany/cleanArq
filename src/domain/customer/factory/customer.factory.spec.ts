import Address from "../value-object/address"
import CustomerFactory from "./customer.factory"

describe("Customer Factory unit test", () => {


    it("should create a customer", () => {

        const customer = CustomerFactory.create("Gabriel Sotero")

        expect(customer.id).toBeDefined()
        expect(customer.name).toBe("Gabriel Sotero")
        expect(customer.Address).toBeUndefined()


    })

    it("should create a customer with an address", () => {
        const address = new Address("Rua 1", 123, "Bh", "Mg", "30770400")
        let customer = CustomerFactory.createWithAddress("Gabriel Sotero", address)

        expect(customer.id).toBeDefined()
        expect(customer.name).toBe("Gabriel Sotero")
        expect(customer.Address).toBeDefined()
        expect(customer.Address).toBe(address)

    })

})