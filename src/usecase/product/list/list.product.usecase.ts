import { canTreatArrayAsAnd } from "sequelize/types/utils";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputProductListDto, OutputProductListDto } from "./list.product.dto";
import Product from "../../../domain/product/entity/product";



export default class ListProductUseCase {

    private productRepository: ProductRepositoryInterface;

    constructor(repository: ProductRepositoryInterface) {
        this.productRepository = repository;
    }


    async execute(input: InputProductListDto): Promise<OutputProductListDto> {
        try {
            const products = await this.productRepository.findAll();
            if (products.length === 0) {
                throw new Error("Products not found");
            }
            return {
                products: products.map(product => {
                    return new Product(product.id, product.name, product.price);
                })
            }


        } catch (error) {
            throw new Error((error as Error).message);
        }
    }



}