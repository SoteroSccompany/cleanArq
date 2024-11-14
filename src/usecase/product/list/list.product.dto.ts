import Product from "../../../domain/product/entity/product";


export interface InputProductListDto { }


export interface OutputProductListDto {
    products: Product[];
}