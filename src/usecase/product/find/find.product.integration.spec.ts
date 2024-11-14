import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import Product from "../../../domain/product/entity/product";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase from "./find.product.usecase";


describe("Integration test found product", () => {

    let sequileze: Sequelize;


    beforeEach(async () => {
        sequileze = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        })

        sequileze.addModels([ProductModel]);
        await sequileze.sync();
    });

    afterEach(async () => {
        await sequileze.close();
    });

    it("Should find a product", async () => {

        const product = new Product("123", "Product 1", 100);
        const productRepository = new ProductRepository();


        const usecase = new FindProductUseCase(productRepository);

        await productRepository.create(product);

        const result = await usecase.execute({ id: "123" })

        const output = {
            id: '123',
            name: "Product 1",
            price: 100
        }

        expect(result).toStrictEqual(output)

    });

    it("Should throw error when find a product", async () => {

        const product = new Product("123", "Product 1", 100);
        const productRepository = new ProductRepository();


        const usecase = new FindProductUseCase(productRepository);

        await productRepository.create(product);

        await expect(usecase.execute({ id: "321" })).rejects.toThrow("Product not found")
    });



});