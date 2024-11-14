import OrderItem from "./order_item";

describe("OrderItem unit test", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            let orderItem = new OrderItem("", "name", 100, "p1", 2)

        }).toThrow('Id is required')
    })

    it("should throw error when name is empty", () => {
        expect(() => {
            let orderItem = new OrderItem("123", "", 100, "p1", 2)

        }).toThrow('Name is required')
    })

    it("should throw error when productId is empty", () => {
        expect(() => {
            let orderItem = new OrderItem("123", "123", 100, "", 2)

        }).toThrow('ProductId is required')
    })

    it("should throw error when price is less or equal zero", () => {
        expect(() => {
            let orderItem = new OrderItem("123", "123", 0, "p1", 2)

        }).toThrow('Price must be greater than zero')
    })

    it("should throw error when quantity is less or equal zero", () => {
        expect(() => {
            let orderItem = new OrderItem("123", "123", 100, "p1", 0)

        }).toThrow('Quantity must be greater than zero')
    })






})