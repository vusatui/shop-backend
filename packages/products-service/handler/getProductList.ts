import { Container } from "typedi";

import ProductsService from "../service/ProductsService";
import stringify from "../util/stringify";
import logRequest from "../middleware/logRequest";

const productService = Container.get(ProductsService);

export default logRequest(async () => ({
    statusCode: 200,
    body: stringify({
            items: await productService.getProductList(),
    }),
}));
