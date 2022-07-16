import ProductsService from "../service/ProductsService";
import ErrorHandlerService from "../service/ErrorHandlerService";
import stringify from "../util/stringify";

const productService = ProductsService.getInstance();
const errorHandlerService = ErrorHandlerService.getInstance();

export default async (event) => {
    const { id: productId } = event.pathParameters;

    try {
        return {
            statusCode: 200,
            body: stringify({
                item: productService.getProductById(productId),
                input: event,
            })
        }
    } catch (e) {
        return errorHandlerService.handleError(e);
    }
};
