import productList from "../mocks/product-list.json";

import {APIGatewayProxyEventV2, Context, SQSEvent} from "aws-lambda";

import { getProductList } from "../handler/getProductList";
import stringify from "../util/stringify";
import { getProductById } from "../handler/getProductById";
import ProductsRepository from "../repository/ProductsRepository";
import {Product} from "../types/product";
import { catalogBatchProcess } from "../handler/catalogBatchProcess";
import ProductValidator from "../validator/ProductValidator";
import Database from "../db";
import ProductsService from "../service/ProductsService";
import cors from "../middleware/cors";
import iterceptError from "../middleware/interceptError";
import {SNSClient} from "@aws-sdk/client-sns";
import ProductNotFoundError from "../error/ProductNotFoundError";

describe("Running test for 'product-service' handlers", () => {
    let context: Context;
    let productRepositoryMock: any;
    let getProductByIdFn: Function;
    let getProductListFn: Function;
    let getCatalogBatchProcessFn: Function;
    let productMock: Product;
    let snsMock: any;
    let invalidProductMock: any;
    let dbMock: any;
    let productServiceMock: any;
    let errorHandlerServiceMock: any;
    let sqsMock: any;

    const getSqsEvent = (body: object) => ({
        Records: [
            {
                body: JSON.stringify(body),
            },
        ],
    });

    beforeEach(() => {
        productRepositoryMock = {
            createProduct: jest.fn(),
        };

        productMock = {
            title: "Product Title",
            description: "Product description",
            price: 10,
            count: 1,
        };

        snsMock = {
            publish: jest.fn(),
        };

        sqsMock = {
            deleteMessage: jest.fn(),
        };

        invalidProductMock = {
            description: "",
            price: "10",
            count: 1,
        };

        dbMock = {
            init: jest.fn(),
            closeConnection: jest.fn(),
        }

        productServiceMock = {
            getProductList: jest.fn(async () => Promise.resolve(productList)),
            getProductById: jest.fn(async (id: string) => {
                const product = productList.find(p => p.id === id);
                if (!product) {
                    throw new ProductNotFoundError();
                } else {
                    return product;
                }
            }),
            createProduct: jest.fn(async () => {}),
        }

        errorHandlerServiceMock = {
            handleError: jest.fn(),
            logError: jest.fn(),
            getBadRequestResponse: jest.fn(),
        }

        getCatalogBatchProcessFn = catalogBatchProcess(dbMock as unknown as Database, new ProductValidator(),
            productRepositoryMock as unknown as ProductsRepository, snsMock as unknown as SNSClient);

        getProductByIdFn = cors(iterceptError(getProductById(dbMock as unknown as Database,
            productServiceMock as unknown as ProductsService, errorHandlerServiceMock)));

        getProductListFn = cors(iterceptError(getProductList(dbMock as unknown as Database,
            productServiceMock as unknown as ProductsService)));
    });

    it("getProductList", async () => {
        expect(await getProductListFn())
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

        expect(await getProductByIdFn(event as unknown as APIGatewayProxyEventV2))
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

        expect(await getProductByIdFn(event as unknown as APIGatewayProxyEventV2, context))
            .toStrictEqual({  statusCode: 200, headers: {'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Allow-Headers': '*',
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",}, body: stringify({ item: product }),  });
    });



    // it("catalogBatchProcess", () => {
    //     getCatalogBatchProcessFn(getSqsEvent(productMock) as SQSEvent, {} as Context, () => ({}));
    //     expect(productRepositoryMock.createProduct).toBeCalled();
    // });
    //
    //
    // it("catalogBatchProcess - invalid product", () => {
    //     getCatalogBatchProcessFn(getSqsEvent(invalidProductMock) as SQSEvent, {} as Context, () => ({}))
    //     expect(productRepositoryMock.createProduct).not.toBeCalled();
    // });
});
