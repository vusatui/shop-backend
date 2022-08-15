import {S3} from 'aws-sdk'
import cors from '@middy/http-cors'
import {formatJSONResponse} from "@libs/api-gateway";

import middy from "@middy/core";
import {AWS_REGION, CORS_ORIGINS, S3_UPLOADS_BUCKET_NAME, S3_UPLOADS_PREFIX} from "../../constants";
import {APIGatewayProxyEventV2, Handler} from "aws-lambda";

const s3 = new S3({
    region: AWS_REGION,
    signatureVersion: 'v4',
});

export const importProductsFile: Handler = async (event: APIGatewayProxyEventV2) => {
    const {name} = event.queryStringParameters;

    const params = {
        Bucket: S3_UPLOADS_BUCKET_NAME,
        Expires: 3600 * 10,
        Key: `${S3_UPLOADS_PREFIX}${name}`,
    }

    const signedUrl = await s3.getSignedUrlPromise('putObject', params);

    console.log(signedUrl);

    return formatJSONResponse(signedUrl);
};

export const main = middy(importProductsFile).use(cors({
    origins: CORS_ORIGINS,
    credentials: true,
}));
