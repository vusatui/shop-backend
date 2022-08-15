import { SQSHandler } from "aws-lambda";
import { Container } from "typedi";

import ProductValidator from "../validator/ProductValidator";
import ProductsRepository from "../repository/ProductsRepository";

import { Product } from "../types/product";

export const catalogBatchProcess: (productValidator: ProductValidator, productRepository: ProductsRepository) => SQSHandler =
    (productValidator, productRepository) => async (event) => {
        for (const record of event.Records) {
            const product: Product = JSON.parse(record.body);

            try {
                productValidator.validateProduct(product);
                await productRepository.createProduct(product);
                console.log(record.body, " - product successfully added.");
            } catch (e) {
                console.log(e);
            }
        }
    };

export default catalogBatchProcess(Container.get(ProductValidator), Container.get(ProductsRepository));
