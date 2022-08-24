import {S3, SQS} from "aws-sdk";
import {S3Event, S3EventRecord, S3Handler} from "aws-lambda";
import middy from "@middy/core";
import {AWS_REGION, SQS_NAME} from "../../constants";
import csvParser from "csv-parser";

const s3 = new S3({apiVersion: '2006-03-01', region: AWS_REGION});
const sqs = new SQS({ region: AWS_REGION });

const handleRecord = async (s3Instance: S3, record: S3EventRecord, context) => {
    const bucket = record.s3.bucket.name;
    const fileName = record.s3.object.key.split("/")[1];
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
    const rawObjectParams = {
        Bucket: bucket,
        Key: key,
    };
    const accountId = context.invokedFunctionArn.split(":")[4];
    const queueUrl = `https://sqs.${AWS_REGION}.amazonaws.com/${accountId}/${SQS_NAME}`;

    try {
        const s3Object$ = s3Instance.getObject(rawObjectParams).createReadStream();
        console.log(`Object '${fileName}' has bee successfully received.`);
        s3Object$
            .pipe(csvParser({ separator: ";" }))
            .on("err", (err) => {
                console.log(err)
            })
            .on("end", () => {
                console.log(`Stream of object '${fileName}' has been completed.`);
            })
            .on("data", (chunk) => {
                const product = JSON.stringify(chunk);
                console.log("data:", chunk);
                const sqsParams = {
                    MessageBody: product,
                    QueueUrl: queueUrl
                };
                sqs.sendMessage(sqsParams, console.log);
            });
        await s3Instance.upload({Bucket: bucket, Key: `parsed/${fileName}`, Body: s3Object$}).promise();
        await s3Instance.deleteObject(rawObjectParams).promise();
        console.log(`Object '${key}' has bee deleted from .`);
    } catch (e) {
        console.log(e);
    }
};

const importFileParser: S3Handler = async (event: S3Event, context) => {
    console.log("============================");
    try {
        await Promise.all(event.Records.map(record => handleRecord(s3, record, context)))
    } catch (e) {
        console.log("Error was occurred during parsing uploaded files.", e);
    }
};

export const main = middy(importFileParser);
