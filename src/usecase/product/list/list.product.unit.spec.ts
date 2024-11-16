import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";




const product1 = new Product("123", 'Product 1', 10);
const product2 = new Product("124", 'Product 2', 20);

const MockRepository = () => {
    return {
        findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
        find: jest.fn().mockReturnValue(Promise.resolve(product1)),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe("Unit test list products", () => {


    it("Should list products", async () => {

        const productRepository = MockRepository();
        const usecase = new ListProductUseCase(productRepository);

        const output = await usecase.execute({});

        expect(output.products).toStrictEqual([{
            id: product1.id,
            name: product1.name,
            price: product1.price
        }, {
            id: product2.id,
            name: product2.name,
            price: product2.price
        }]);
    });

    it("Should throw error when product not found", async () => {

        const productRepository = MockRepository();
        productRepository.findAll = jest.fn().mockReturnValue(Promise.resolve([]));
        const usecase = new ListProductUseCase(productRepository);
        await expect(usecase.execute({})).rejects.toThrow("Products not found");

    });





});