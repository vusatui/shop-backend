import productList from "../mocks/product-list.json";

import {APIGatewayProxyEventV2, Context, SQSEvent} from "aws-lambda";

import getProductList from "../handler/getProductList";
import stringify from "../util/stringify";
import getProductById from "../handler/getProductById";
import ProductsRepository from "../repository/ProductsRepository";
import {Product} from "../types/product";
import { catalogBatchProcess } from "../handler/catalogBatchProcess";
import ProductValidator from "../validator/ProductValidator";

const productMock: Product = {
    title: "Product Title",
    description: "Product description",
    price: 10,
    count: 1,
};

const invalidProductMock = {
    description: "",
    price: "10",
    count: 1,
};


describe("Running test for 'product-service' handlers", () => {
    let context: Context;
    let productRepositoryMock: any;

    const getCatalogBatchProcessFn = () => catalogBatchProcess(
        new ProductValidator(), productRepositoryMock as unknown as ProductsRepository);
    const getSqsEvent = (body: object) => ({
        Records: [
            {
                body: JSON.stringify(body),
            },
        ],
    });

    beforeAll(() => {
        ProductsRepository.prototype.getProducts = jest.fn(() => Promise.resolve(productList));
        ProductsRepository.prototype.getProductById = jest.fn((id: string) => Promise.resolve(productList.find(p => p.id === id)));
    });

    beforeEach(() => {
        productRepositoryMock = {
            createProduct: jest.fn(),
        };
    });

    it("getProductList", async () => {
        expect(await getProductList({} as unknown as APIGatewayProxyEventV2, context))
            .toStrictEqual({ statusCode: 200, headers: {'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Allow-Headers': '*',
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"}, body: stringify({ items: productList }) });
    });

    it("getProductById: product not found", async() => {
        const event = {
          pathParameters: {
              id: "",
          },
        };

        expect(await getProductById(event as unknown as APIGatewayProxyEventV2, context))
            .toStrictEqual({  statusCode: 404, headers: {'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Allow-Headers': '*',
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"}, body: stringify({ message: "Product not found!" }),  });
    });

    it("getProductById: product successfully found", async() => {
        const id = "7567ec4b-b10c-48c5-9345-fc73c48a80aa";
        const product = productList.find(({ id: productId }) => id === productId);
        const event = {
          pathParameters: {
              id,
          },
        };

        expect(await getProductById(event as unknown as APIGatewayProxyEventV2, context))
            .toStrictEqual({  statusCode: 200, headers: {'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Allow-Headers': '*',
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",}, body: stringify({ item: product }),  });
    });



    it("catalogBatchProcess", () => {
        const catalogBatchProcessFn = getCatalogBatchProcessFn();
        catalogBatchProcessFn(getSqsEvent(productMock) as SQSEvent, {} as Context, () => ({}));
        expect(productRepositoryMock.createProduct).toBeCalled();
    });


    it("catalogBatchProcess - invalid product", () => {
        const catalogBatchProcessFn = getCatalogBatchProcessFn();
        catalogBatchProcessFn(getSqsEvent(invalidProductMock) as SQSEvent, {} as Context, () => ({}))
        expect(productRepositoryMock.createProduct).not.toBeCalled();
    });
});
