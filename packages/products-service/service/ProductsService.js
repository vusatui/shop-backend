import productsList from "../mocks/product-list.json";
import Singleton from "../auxiliary/Singleton";
import ProductNotFoundError from "../error/ProductNotFoundError";

export default class ProductsService extends Singleton {

    getProductList() {
        return productsList;
    }

    getProductById(id) {
        const product = productsList.find(({ id: productId }) => id === productId);

        if (product === undefined) {
            throw new ProductNotFoundError();
        }

        return product;
    }
}