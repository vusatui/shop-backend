import { Container } from "typedi";

import ProductsService from "../service/ProductsService";
import stringify from "../util/stringify";

const productService = Container.get(ProductsService);

export default async () => ({
    statusCode: 200,
    body: stringify({
            items: productService.getProductList(),
        }),
});
