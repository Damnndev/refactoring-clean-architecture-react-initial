import { MockWebServer } from "../../../tests/MockWebServer";
import productResponse from "./data/productsResponse.json";

export function givenAProducts(mockWebServer: MockWebServer) {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `https://fakestoreapi.com/products`,
            httpStatusCode: 200,
            response: productResponse,
        },
    ]);
}

export function givenNoProducts(mockWebServer: MockWebServer) {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `https://fakestoreapi.com/products`,
            httpStatusCode: 200,
            response: [],
        },
    ]);
}
