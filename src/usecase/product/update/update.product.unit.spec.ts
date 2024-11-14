import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";


const product = new Product("123", 'Product 1', 10);

const MockRepository = () => {
    return {
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        create: jest.fn(),
        update: jest.fn(),
    }
}


describe("Unit test update an product", () => {

    it("Should update an product", async () => {

        const productRepository = MockRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        const input = {
            id: product.id,
            name: "Product 2",
            price: 20
        }

        const output = await usecase.execute(input);

        expect(output).toStrictEqual(input);
    });

    it("Should throw error when product not found", async () => {

        const productRepository = MockRepository();
        productRepository.find = jest.fn().mockReturnValue(Promise.resolve(null));
        const usecase = new UpdateProductUseCase(productRepository);
        await expect(usecase.execute({ id: "123", name: "Product 2", price: 20 })).rejects.toThrow("Product not found");


    });


});