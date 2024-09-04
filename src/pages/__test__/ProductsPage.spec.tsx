import { render, RenderResult, screen } from "@testing-library/react";
import { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, test } from "vitest";
import { AppProvider } from "../../context/AppProvider";
import { ProductsPage } from "../ProductsPage";
import { MockWebServer } from "./MockWebServer";
import productResponse from "./data/productsResponse.json";

const mockWebServer = new MockWebServer();

describe("ProductsPage", () => {
    beforeAll(() => {
        mockWebServer.start();
    });
    afterEach(() => {
        mockWebServer.resetHandlers();
    });
    afterAll(() => {
        mockWebServer.close();
    });

    test("Loads and displays title", async () => {
        givenAProducts();

        renderComponent(<ProductsPage />);

        await screen.findAllByRole("heading", { name: "Product price updater" });
    });
});

function givenAProducts() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `https://fakestoreapi.com/products`,
            httpStatusCode: 200,
            response: productResponse,
        },
    ]);
}

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
