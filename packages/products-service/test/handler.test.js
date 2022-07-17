import productList from "../mocks/product-list.json";

import getProductList from "../handler/getProductList";
import stringify from "../util/stringify";
import getProductById from "../handler/getProductById";


describe("Running test for 'product-service' handlers", () => {

    it("getProductList", async () => {
        expect(await getProductList()).toStrictEqual({ statusCode: 200, body: stringify({ items: productList }) });
    });

    it("getProductById: product not found", async() => {
        const event = {
          pathParameters: {
              id: "",
          },
        };

        expect(await getProductById(event)).toStrictEqual({  statusCode: 404, body: stringify({ message: "Product not found!" }),  });
    });

    it("getProductById: product successfully found", async() => {
        const id = "7567ec4b-b10c-48c5-9345-fc73c48a80aa";
        const product = productList.find(({ id: productId }) => id === productId);
        const event = {
          pathParameters: {
              id,
          },
        };

        expect(await getProductById(event)).toStrictEqual({  statusCode: 200, body: stringify({ item: product }),  });
    });
});
