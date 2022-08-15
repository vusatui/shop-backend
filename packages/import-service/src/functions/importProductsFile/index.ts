import { handlerPath } from "@libs/handler-resolver";
import {CORS_ORIGINS} from "../../constants";

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: "get",
                path: "import",
                cors: {
                    origins: CORS_ORIGINS,
                },
                description: "Uploads files to S3",
                queryStringParameters: {
                    name: {
                        required: true,
                        type: 'string',
                        description: 'Name of the uploading file.',
                    },
                },
            }
        }
    ]
}
