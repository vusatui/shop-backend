import productsList from "../mocks/product-list.json";
import ProductNotFoundError from "../error/ProductNotFoundError";
import { Product } from "../types/product";
import { Service } from "typedi";

@Service()
export default class ProductsService {

    private static products: Product[] = productsList;

    getProductList() {
        return ProductsService.products;
    }

    getProductById(id: string) {
        const product = ProductsService.products.find(({ id: productId }) => id === productId);

        if (product === undefined) {
            throw new ProductNotFoundError();
        }

        return product;
    }
}