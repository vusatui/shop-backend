'use strict';

const productsList = require("./product-list.json");

module.exports.getProductsList = async (event) => {
  return {
        statusCode: 200,
        body: JSON.stringify(
            {
                items: productsList,
                input: event,
            }, null, 2),
    };
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.getProductById = async (event) => {
    console.log(event);
    const { id: productId } = event.pathParameters;

    const product = productsList.find(({ id }) => id === productId );

    if (product) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                item: product,
                input: event,
            }, null, 2),
        };
    }

    return {
        statusCode: 404,
        body: JSON.stringify({
            message: "Product not found!",
        }),
    };
}