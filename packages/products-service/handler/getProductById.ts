import { APIGatewayProxyEventPathParameters, APIGatewayProxyEventV2 } from 'aws-lambda';


import { Container } from "typedi";

import ProductsService from "../service/ProductsService";
import ErrorHandlerService from "../service/ErrorHandlerService";
import stringify from "../util/stringify";
import logRequest from "../middleware/logRequest";

const productService = Container.get(ProductsService);
const errorHandlerService =  Container.get(ErrorHandlerService);

export default logRequest(async (event: APIGatewayProxyEventV2) => {
    const { id: productId } = event.pathParameters as APIGatewayProxyEventPathParameters;

    if (productId === undefined) {
        return ErrorHandlerService.getBadRequestResponse();
    }

    try {
        return {
            statusCode: 200,
            body: stringify({
                item: await productService.getProductById(productId),
            }),
        };
    } catch (e) {
        return errorHandlerService.handleError(e as Error);
    }
});
