import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputUpdateProductDto, OutputUpdateProductDto } from "./update.product.dto";



export default class UpdateProductUseCase {

    private productRepository: ProductRepositoryInterface;


    constructor(repository: ProductRepositoryInterface) {
        this.productRepository = repository;
    }

    async execute(input: InputUpdateProductDto): Promise<OutputUpdateProductDto> {
        try {
            const product = await this.productRepository.find(input.id);
            if (!product) {
                throw new Error("Product not found");
            }
            product.changeName(input.name);
            product.changePrice(input.price);
            await this.productRepository.update(product);
            return {
                id: input.id,
                name: input.name,
                price: input.price,
            }
        } catch (error) {
            throw new Error((error as Error).message);
        }

    }


}