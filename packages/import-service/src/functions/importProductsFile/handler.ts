import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

import middy from "@middy/core";
import schema from './schema';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const { name } = event.queryStringParameters;



    return formatJSONResponse(name);
};

export const main = middy(importProductsFile);
