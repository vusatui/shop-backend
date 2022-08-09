import {handlerPath} from "@libs/handler-resolver";
import {S3_UPLOADS_BUCKET_NAME, S3_UPLOADS_PREFIX} from "../../constants";


export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            s3: {
                bucket: S3_UPLOADS_BUCKET_NAME,
                event: 's3:ObjectCreated:*',
                rules: [
                    {
                        prefix: `${S3_UPLOADS_PREFIX}`,
                    },
                ],
                existing: true,
            },
        },
    ],
};
