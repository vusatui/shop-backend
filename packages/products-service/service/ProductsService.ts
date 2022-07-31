import { Service } from "typedi";

import ProductNotFoundError from "../error/ProductNotFoundError";
import ProductsRepository from "../repository/ProductsRepository";
import { Product } from "../types/product";

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

    async createProduct(product: Product) {
        return this.productsRepository.createProduct(product);
    }
}