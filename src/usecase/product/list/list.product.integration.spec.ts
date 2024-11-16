import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";




const product1 = new Product("123", 'Product 1', 10);
const product2 = new Product("124", 'Product 2', 20);



describe("Unit test list products", () => {


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



    it("Should list products", async () => {

        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);

        await productRepository.create(product1);
        await productRepository.create(product2);

        const output = await usecase.execute({});

        expect(output.products.length).toBe(2);
        expect(output.products[0]).toStrictEqual({
            id: product1.id,
            name: product1.name,
            price: product1.price
        });
        expect(output.products[1]).toStrictEqual({
            id: product2.id,
            name: product2.name,
            price: product2.price
        });

    });

    it("Should throw error when product not found", async () => {

        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);

        await expect(usecase.execute({})).rejects.toThrow("Products not found");



    });





});