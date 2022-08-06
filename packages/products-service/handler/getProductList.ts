import { Container } from "typedi";

import ProductsService from "../service/ProductsService";
import stringify from "../util/stringify";
import logRequest from "../middleware/logRequest";
import iterceptError from "../middleware/interceptError";
import cors from "../middleware/cors";

const productService = Container.get(ProductsService);

export default cors(iterceptError(logRequest(async () => ({
    statusCode: 200,
    body: stringify({
            items: await productService.getProductList(),
    }),
}))));
