import { Container } from "typedi";

import ProductsService from "../service/ProductsService";
import stringify from "../util/stringify";
import logRequest from "../middleware/logRequest";
import iterceptError from "../middleware/interceptError";
import cors from "../middleware/cors";
import Database from "../db";

export const getProductList = (db: Database, productService: ProductsService) => async () => {
    try {
        await db.init();
        return {
            statusCode: 200,
            body: stringify({
                items: await productService.getProductList(),
            }),
        };
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export default cors(iterceptError(logRequest(getProductList(Container.get(Database), Container.get(ProductsService)))));
