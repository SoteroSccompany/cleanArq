import Product from "../entity/product"
import ProductService from "./product.service"


describe("Product service unit test", () => {

    it("should channge the prices of all products", () => {

        const product1 = new Product("product1", "product 1", 100)
        const product2 = new Product("product2", "product 2", 50)
        const product3 = new Product("product3", "product 3", 30)

        ProductService.increasePrice([product1, product2, product3], 10)

        expect(product1.price).toBe(110)
        expect(product2.price).toBe(55)
        expect(product3.price).toBe(33)

    })

})