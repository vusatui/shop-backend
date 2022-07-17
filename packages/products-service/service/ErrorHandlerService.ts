import ProductNotFoundError from "../error/ProductNotFoundError";
import stringify from "../util/stringify";
import { Service } from "typedi";

@Service()
export default class ErrorHandlerService {

    private static badRequestErrorMessage: string = "Bad request!";

    handleError(error: Error) {
        if (error instanceof ProductNotFoundError) {
            return {
                statusCode: 404,
                body: stringify({
                    message: error.message,
                }),
            };
        }

        return ErrorHandlerService.getBadRequestResponse();
    }

    static getBadRequestResponse() {
        return {
            statusCode: 400,
            body: stringify({
                message: ErrorHandlerService.badRequestErrorMessage,
            }),
        };
    }
}