import ProductNotFoundError from "../error/ProductNotFoundError";
import stringify from "../util/stringify";
import { Service } from "typedi";
import InternalServerError from "../error/InternalServerError";

@Service()
export default class ErrorHandlerService {

    private static badRequestErrorMessage: string = "Bad request!";

    handleError(error: Error) {
        if (error instanceof InternalServerError) {
            return ErrorHandlerService.getResponse(500, error.message);
        }

        if (error instanceof ProductNotFoundError) {
            return ErrorHandlerService.getResponse(404, error.message);
        }

        return ErrorHandlerService.getBadRequestResponse();
    }

    private static getResponse(statusCode: number, message: string) {
        return {
            statusCode,
            body: stringify({
                message,
            }),
        };
    }

    static getBadRequestResponse() {
        return ErrorHandlerService.getResponse(400, ErrorHandlerService.badRequestErrorMessage);
    }
}