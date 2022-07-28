import { Service } from "typedi";
import Database from "../db";
import { Product } from "../types/product";
import InternalServerError from "../error/InternalServerError";
import ProductValidator from "../validator/ProductValidator";

@Service()
export default class ProductsRepository {

    constructor(
        private readonly database: Database,
        private readonly productValidator: ProductValidator
    ) {
    }

    async getProducts() {
        try {
            const res = await this.database.query<Product>(`
                SELECT 
                    products.id, products.title, products.description, products.price, stocks.count
                FROM 
                    products
                LEFT JOIN 
                    stocks 
                       ON products.id = stocks.product_id
            `, []);

            return res.rows;
        } catch (e) {
            console.error(e);
            throw new InternalServerError();
        }
    }

    async getProductById(id: string) {
        try {
            if (!this.productValidator.validateProductId(id)) {
                return;
            }

            const res = await this.database.query<Product>(`
                SELECT 
                    products.id, products.title, products.description, products.price, stocks.count
                FROM 
                    products
                LEFT JOIN 
                    stocks 
                       ON products.id = stocks.product_id
                WHERE 
                    products.id=$1
            `, [id]);

            return res.rows[0];
        } catch (e) {
            console.error(e)
            throw new InternalServerError();
        }
    }
}
