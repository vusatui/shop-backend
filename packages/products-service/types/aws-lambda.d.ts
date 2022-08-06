import { APIGatewayProxyEventV2, APIGatewayProxyResult, Context } from "aws-lambda";

export type LambdaHandler = (event: APIGatewayProxyEventV2, context?: Context) => Promise<APIGatewayProxyResult>