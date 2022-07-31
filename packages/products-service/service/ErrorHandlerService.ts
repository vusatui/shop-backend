import ProductNotFoundError from "../error/ProductNotFoundError";
import stringify from "../util/stringify";
import { Service } from "typedi";
import InternalServerError from "../error/InternalServerError";
import ProductNotValid from "../error/ProductNotValid";
import { APIGatewayProxyResult } from "aws-lambda";

@Service()
export default class ErrorHandlerService {

    private static badRequestErrorMessage: string = "Bad request!";

    handleError(error: Error): APIGatewayProxyResult {
        ErrorHandlerService.logError(error);

        if (error instanceof InternalServerError) {
            return ErrorHandlerService.getResponse(500, error.message);
        }

        if (error instanceof ProductNotFoundError) {
            return ErrorHandlerService.getResponse(404, error.message);
        }

        if (error instanceof ProductNotValid) {
            return ErrorHandlerService.getResponse(400, error.message);
        }

        return ErrorHandlerService.getBadRequestResponse();
    }

    private static getResponse(statusCode: number, message: string): APIGatewayProxyResult {
        return {
            statusCode,
            body: stringify({
                message,
            }),
        };
    }

    static logError(e: Error) {
        console.log(e.message);
    }

    static getBadRequestResponse() {
        return ErrorHandlerService.getResponse(400, ErrorHandlerService.badRequestErrorMessage);
    }
}