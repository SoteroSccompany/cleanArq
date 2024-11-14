import CreateProductUseCase from "./create.product.usecase"



const input = {
    type: 'a',
    name: 'Product 1',
    price: 100
}

const MockRepository = () => {
    return {
        findAll: jest.fn(),
        find: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    }
}

describe("Unit test create product", () => {

    it("Should create a product", async () => {

        const productRepository = MockRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const output = await usecase.execute(input)

        expect(output).toStrictEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price
        })




    })


})