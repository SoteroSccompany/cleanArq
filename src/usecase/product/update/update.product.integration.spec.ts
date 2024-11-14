import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";


const product = new Product("123", 'Product 1', 10);



describe("Unit test update an product", () => {


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

    it("Should update an product", async () => {

        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        await productRepository.create(product);

        const input = {
            id: product.id,
            name: "Product 2",
            price: 20
        }

        const output = await usecase.execute(input);

        expect(output).toStrictEqual(input);
    });

    it("Should throw error when product not found", async () => {

        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        await productRepository.create(product);

        const input = {
            id: "321",
            name: "Product 2",
            price: 20
        }

        await expect(usecase.execute(input)).rejects.toThrow("Product not found");

    });


});