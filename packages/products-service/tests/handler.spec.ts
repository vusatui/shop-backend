import productList from "../mocks/product-list.json";

import { APIGatewayProxyEventV2, Context } from "aws-lambda";

import getProductList from "../handler/getProductList";
import stringify from "../util/stringify";
import getProductById from "../handler/getProductById";
import ProductsRepository from "../repository/ProductsRepository";




describe("Running test for 'product-service' handlers", () => {
    let context: Context;

    beforeAll(() => {
        ProductsRepository.prototype.getProducts = jest.fn(() => Promise.resolve(productList));
        ProductsRepository.prototype.getProductById = jest.fn((id: string) => Promise.resolve(productList.find(p => p.id === id)));
    })

    it("getProductList", async () => {
        expect(await getProductList({} as unknown as APIGatewayProxyEventV2, context)).toStrictEqual({ statusCode: 200, headers: {}, body: stringify({ items: productList }) });
    });

    it("getProductById: product not found", async() => {
        const event = {
          pathParameters: {
              id: "",
          },
        };

        expect(await getProductById(event as unknown as APIGatewayProxyEventV2, context)).toStrictEqual({  statusCode: 404, headers: {}, body: stringify({ message: "Product not found!" }),  });
    });

    it("getProductById: product successfully found", async() => {
        const id = "7567ec4b-b10c-48c5-9345-fc73c48a80aa";
        const product = productList.find(({ id: productId }) => id === productId);
        const event = {
          pathParameters: {
              id,
          },
        };

        expect(await getProductById(event as unknown as APIGatewayProxyEventV2, context)).toStrictEqual({  statusCode: 200, headers: {}, body: stringify({ item: product }),  });
    });
});
