import {S3} from 'aws-sdk'
import cors from '@middy/http-cors'
import {formatJSONResponse} from "@libs/api-gateway";

import middy from "@middy/core";
import {AWS_REGION, CORS_ORIGINS, S3_UPLOADS_BUCKET_NAME} from "../../constants";
import {APIGatewayProxyEventV2, Handler} from "aws-lambda";

const importProductsFile: Handler = async (event: APIGatewayProxyEventV2) => {
    const {name} = event.queryStringParameters;

    const s3 = new S3({
        region: AWS_REGION,
        signatureVersion: 'v4',
    });

    const params = {
        Bucket: S3_UPLOADS_BUCKET_NAME,
        Expires: 3600 * 10,
        Key: `uploads/${name}`,
    }

    const signedUrl = await s3.getSignedUrlPromise('putObject', params);

    console.log(signedUrl);

    return formatJSONResponse(signedUrl);
};

export const main = middy(importProductsFile).use(cors({
    origins: CORS_ORIGINS,
    credentials: true,
}));
