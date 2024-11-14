import Address from "../value-object/address"
import Customer from "./customer"


describe("Customer unit test", () => {

    it("should throw error when id is empty", () => {

        expect(() => {
            let customer = new Customer("", "name")
        }).toThrow('Id is required')
    })

    it("should throw error when name is empty", () => {

        expect(() => {
            let customer = new Customer("123", "")
        }).toThrow('Name is required')
    })

    it("should change name", () => {
        let customer = new Customer("123", "name")

        customer.changeName("Gabriel")

        expect(customer.name).toBe("Gabriel")

    })

    it("should activate customer", () => {
        const customer = new Customer("123", "Gabriel")
        const addres = new Address("Rua 1", 123, "Bh", "Mg", "30770400")
        customer.Address = addres
        customer.activate()
        expect(customer.isActive()).toBe(true)

    });

    it("should deactivate customer", () => {
        const customer = new Customer("123", "Gabriel")
        customer.deactivate()
        expect(customer.isActive()).toBe(false)
    });


    it("should throw error when address is undefined", () => {
        const customer = new Customer("123", "Gabriel")
        expect(() => {
            customer.activate()
        }).toThrow('Address is required')

    });

    it("should throw error when add points in customer deactive", () => {
        const customer = new Customer("123", "Gabriel")
        expect(() => {
            customer.addRewardPoints(100)
        }).toThrow('Customer is not active')
    })

    it("should add points in customer", () => {
        const customer = new Customer("123", "Gabriel")
        const addres = new Address("Rua 1", 123, "Bh", "Mg", "30770400")
        customer.Address = addres
        customer.activate()
        expect(customer.points).toBe(0)
        customer.addRewardPoints(100)
        expect(customer.points).toBe(100)
        customer.addRewardPoints(100)
        expect(customer.points).toBe(200)
    })




})