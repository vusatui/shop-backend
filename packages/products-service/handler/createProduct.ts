import {Container} from "typedi";
import {APIGatewayProxyEventV2} from "aws-lambda";

import logRequest from "../middleware/logRequest";

import ProductsService from "../service/ProductsService";
import ErrorHandlerService from "../service/ErrorHandlerService";
import parseJson from "../util/parseJson";
import {Product} from "../types/product";
import ProductValidator from "../validator/ProductValidator";
import stringify from "../util/stringify";
import iterceptError from "../middleware/interceptError";
import cors from "../middleware/cors";
import Database from "../db";

const productService = Container.get(ProductsService)
const productValidator = Container.get(ProductValidator)
const errorHandlerService = Container.get(ErrorHandlerService)
const db = Container.get(Database)

export default cors(iterceptError(logRequest(async (event: APIGatewayProxyEventV2) => {
    try {
        await db.init();
        const product: Product = parseJson(event.body || "");
        productValidator.validateProduct(product);

        return {
            statusCode: 200,
            body: stringify({
                id: await productService.createProduct(product),
            }),
        };
    } catch (e) {
        return errorHandlerService.handleError(e as Error);
    }
})));
