import ProductsService from "../service/ProductsService";
import stringify from "../util/stringify";

const productService = ProductsService.getInstance();

export default async () => ({
    statusCode: 200,
    body: stringify({
            items: productService.getProductList(),
        }),
});
