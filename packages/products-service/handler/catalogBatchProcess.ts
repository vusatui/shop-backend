import {SQSHandler} from "aws-lambda";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import SQS from "aws-sdk/clients/sqs"
import {Container} from "typedi";

import ProductValidator from "../validator/ProductValidator";
import ProductsRepository from "../repository/ProductsRepository";

import {Product} from "../types/product";
import Database from "../db";

export const catalogBatchProcess: (db: Database, productValidator: ProductValidator, productRepository: ProductsRepository, sns: SNSClient) => SQSHandler =
    (db, productValidator, productRepository,  sns) => async (event, context, callback) => {
        try {
            await db.init();
            let addedItemsLength = 0;
            for (const record of event.Records) {
                const product: Product = JSON.parse(record.body);
                productValidator.validateProduct(product);
                await productRepository.createProduct(product);
                console.log(record.body, " - product successfully added.");
                addedItemsLength++
            }

            console.log('Started to send message to sns', process.env.SNS_TOPIC_ARN)
            const res = await sns.send(new PublishCommand({
                Subject: 'New products created',
                Message: `Products created. ${addedItemsLength}`,
                TargetArn: process.env.SNS_TOPIC_ARN,
            }))
            console.log("Result: ", res)
        } catch (e) {
            console.log("Error: ", e);
        }
    };

export default catalogBatchProcess(Container.get(Database), Container.get(ProductValidator), Container.get(ProductsRepository),
    new SNSClient({ region: process.env.SNS_REGION }));
