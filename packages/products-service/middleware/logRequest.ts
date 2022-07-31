import { LambdaHandler } from "../types/aws-lambda";

export default (handler: LambdaHandler): LambdaHandler => (event, context) =>  {
    console.log("path:", event.routeKey, "headers:", event.headers);
    return handler(event, context);
};
