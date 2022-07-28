import { Service } from "typedi";

import ProductNotFoundError from "../error/ProductNotFoundError";
import ProductsRepository from "../repository/ProductsRepository";

@Service()
export default class ProductsService {

    constructor(
        private readonly productsRepository: ProductsRepository
    ) {}

    async getProductList() {
        return this.productsRepository.getProducts();
    }

    async getProductById(id: string) {
        const product = await this.productsRepository.getProductById(id);

        if (product === undefined) {
            throw new ProductNotFoundError();
        }

        return product;
    }
}