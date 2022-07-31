import {LambdaHandler} from "../types/aws-lambda";

const ALLOWED_ORIGINS = [
    "http://localhost:5555",
    "https://d32kvoiexx06pv.cloudfront.net"
];

export default (handler: LambdaHandler): LambdaHandler => async (event, context) =>  {
    const response = await handler(event, context);

    const origin = event?.headers?.origin || "";
    let headers = response.headers || {};

    if (ALLOWED_ORIGINS.includes(origin)) {
        headers = {
            ...headers,
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Credentials': true,
        };
    }

    return {
        ...response,
        headers,
    }
};