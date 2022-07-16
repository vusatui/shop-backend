import ProductNotFoundError from "../error/ProductNotFoundError";
import Singleton from "../auxiliary/Singleton";
import stringify from "../util/stringify";

export default class ErrorHandlerService extends Singleton {

    static _badRequestErrorMessage = "Bad request!";

    handleError(error) {
        if (error instanceof ProductNotFoundError) {
            return {
                statusCode: 404,
                body: stringify({
                    message: error.message,
                }),
            };
        }


        return {
            statusCode: 400,
            body: stringify({
                message: ErrorHandlerService._badRequestErrorMessage,
            }),
        };
    }
}