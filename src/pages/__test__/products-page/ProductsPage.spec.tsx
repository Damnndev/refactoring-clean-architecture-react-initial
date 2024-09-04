import { render, RenderResult, screen } from "@testing-library/react";
import { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { AppProvider } from "../../../context/AppProvider";
import { MockWebServer } from "../../../tests/MockWebServer";
import { ProductsPage } from "../../ProductsPage";
import { givenAProducts, givenNoProducts } from "./ProductsPage.fixture";
import { verifyHeader, verifyRows, waitToTableIsLoaded } from "./ProductsPage.helpers";

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

    describe("Table", () => {
        test("Loads and displays title", async () => {
            givenAProducts(mockWebServer);

            renderComponent(<ProductsPage />);

            await screen.findAllByRole("heading", { name: "Product price updater" });
        });
        test("should render an empty table when there are no data", async () => {
            givenNoProducts(mockWebServer);

            renderComponent(<ProductsPage />);

            const rows = await screen.findAllByRole("row");

            expect(rows.length).toBe(1);

            verifyHeader(rows[0]);
        });
        test("should render expect header and rows", async () => {
            const products = givenAProducts(mockWebServer);

            renderComponent(<ProductsPage />);

            await waitToTableIsLoaded();

            const allRows = await screen.findAllByRole("row");

            const[header, ...rows] = allRows;

            verifyHeader(header);

            verifyRows(rows, products);
        });
    });
});

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
