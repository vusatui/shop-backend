import { APIGatewayProxyEventPathParameters, APIGatewayProxyEventV2 } from 'aws-lambda';


import { Container } from "typedi";

import ProductsService from "../service/ProductsService";
import ErrorHandlerService from "../service/ErrorHandlerService";
import stringify from "../util/stringify";
import logRequest from "../middleware/logRequest";
import iterceptError from "../middleware/interceptError";
import cors from "../middleware/cors";
import Database from "../db";

export const getProductById = (db: Database, productService: ProductsService, errorHandlerService: ErrorHandlerService) => async (event: APIGatewayProxyEventV2) => {
    await db.init();
    const { id: productId } = event.pathParameters as APIGatewayProxyEventPathParameters;
    if (productId === undefined) {
        return ErrorHandlerService.getBadRequestResponse();
    }

    return {
        statusCode: 200,
        body: stringify({
            item: await productService.getProductById(productId),
        }),
    };
};

export default cors(
    iterceptError(
        logRequest(
            getProductById(Container.get(Database), Container.get(ProductsService), Container.get(ErrorHandlerService))
        )
    )
);
