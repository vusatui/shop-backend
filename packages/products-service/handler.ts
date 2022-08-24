import "reflect-metadata";

import getProductsList from "./handler/getProductList";
import getProductById from "./handler/getProductById";
import createProduct from "./handler/createProduct";
import catalogBatchProcess from "./handler/catalogBatchProcess";

export {
    getProductsList,
    getProductById,
    createProduct,
    catalogBatchProcess,
};