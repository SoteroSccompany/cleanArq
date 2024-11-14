import Product from "../entity/product";

export default class ProductService {

    // static increasePrice(products: Product[], percentage: number): Product[] {
    //     products.forEach(product => {
    //         product.changePrice(product.price + (product.price * percentage / 100))
    //     })
    //     return products; //Outra forma de realizar a instancia da funcao de increase
    // }

    static increasePrice(products: Product[], percentage: number): void {
        products.forEach(product => {
            product.changePrice(product.price + (product.price * percentage / 100))
        })
    }
}