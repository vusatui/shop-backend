import { Service } from "typedi";
import Joi from "joi";
import {Product} from "../types/product";
import ProductNotValid from "../error/ProductNotValid";


@Service()
export default class ProductValidator {

    validateProductId(id: string) {
        return !Joi.string().guid({ version: [ "uuidv4" ] }).validate(id).error;
    }

    validateProduct(product: Product) {
        const validationResult = Joi.object({
            title: Joi.string().max(255).required(),
            description: Joi.string().required(),
            price: Joi.number().positive().required(),
            count: Joi.number().positive().required()
        }).validate(product);

        if (validationResult.error) {
            throw new ProductNotValid(validationResult.error.message);
        }
    }
}