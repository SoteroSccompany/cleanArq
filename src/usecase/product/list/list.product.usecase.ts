import { canTreatArrayAsAnd } from "sequelize/types/utils";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputProductListDto, OutputProductListDto } from "./list.product.dto";
import Product from "../../../domain/product/entity/product";
import ProductInterface from "../../../domain/product/entity/product.interface";



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
            return OutputMapper.toOutPut(products);
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}

class OutputMapper {
    static toOutPut(products: ProductInterface[]): OutputProductListDto {
        return {
            products: products.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price
            }))
        }
    }
}