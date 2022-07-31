import { Container } from "typedi";

import { LambdaHandler } from "../types/aws-lambda";
import ErrorHandlerService from "../service/ErrorHandlerService";

const errorHandlerService = Container.get(ErrorHandlerService)

export default (handler: LambdaHandler): LambdaHandler => async (event, context) =>  {
    try {
        return await handler(event, context);
    } catch (e) {
        return errorHandlerService.handleError(e as Error);
    }
};