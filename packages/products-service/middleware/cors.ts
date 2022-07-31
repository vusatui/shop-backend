import { LambdaHandler } from "../types/aws-lambda";

export default (handler: LambdaHandler): LambdaHandler => async (event, context) =>  {
    const response = await handler(event, context);

    let headers = {
        ...response?.headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': '*',
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    };

    return {
        ...response,
        headers,
    }
};