import { handlerPath } from "@libs/handler-resolver";

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: "get",
                path: "import",
                cors: true,
                description: "Uploads files to S3",
                inputType: 'string',
                // consumes: ['multipart/form-data'],
                // parameters: [
                //     {
                //         in: 'formData',
                //         name: 'upfile',
                //         type: 'file',
                //         description: 'The file to upload.',
                //     }
                // ]
            }
        }
    ]
}