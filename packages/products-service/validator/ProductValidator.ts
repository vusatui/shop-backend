import { Service } from "typedi";
import Joi from "joi";


@Service()
export default class ProductValidator {

    validateProductId(id: string) {
        return !Joi.string().guid({ version: [ "uuidv4" ] }).validate(id).error;
    }
}