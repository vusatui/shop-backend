import { Container } from "typedi";
import { APIGatewayProxyEventV2 } from "aws-lambda";

import logRequest from "../middleware/logRequest";

import ProductsService from "../service/ProductsService";
import ErrorHandlerService from "../service/ErrorHandlerService";
import parseJson from "../util/parseJson";
import { Product } from "../types/product";
import ProductValidator from "../validator/ProductValidator";
import stringify from "../util/stringify";
import iterceptError from "../middleware/interceptError";

const productService = Container.get(ProductsService)
const productValidator = Container.get(ProductValidator)
const errorHandlerService = Container.get(ErrorHandlerService)

export default iterceptError(logRequest(async (event: APIGatewayProxyEventV2) => {
    try {
        const product: Product = parseJson(event.body || "");

        productValidator.validateProduct(product);

        return {
            statusCode: 200,
            body: stringify({
                id: await productService.createProduct(product)
            }),
        };
    } catch (e) {
        return errorHandlerService.handleError(e as Error);
    }
}));
