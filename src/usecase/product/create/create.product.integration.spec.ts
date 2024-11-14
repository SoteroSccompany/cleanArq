import { Sequelize } from "sequelize-typescript";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create.product.usecase"
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";


describe("Unit test create product", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        })
        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("Should create a product", async () => {

        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input = {
            type: 'a',
            name: 'Product 1',
            price: 100
        }

        const output = await usecase.execute(input)

        expect(output).toStrictEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price
        })
    })

    it("Should throw an error when creating a product", async () => {

        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input = {
            type: 'c',
            name: 'Product 1',
            price: 100
        }

        await expect(usecase.execute(input)).rejects.toThrow("Invalid product type")
    });


})