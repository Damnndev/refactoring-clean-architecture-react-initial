import { render, RenderResult, screen } from "@testing-library/react";
import { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { AppProvider } from "../../../context/AppProvider";
import { MockWebServer } from "../../../tests/MockWebServer";
import { ProductsPage } from "../../ProductsPage";
import { givenAProducts, givenNoProducts } from "./ProductsPage.fixture";
import {
    changeToNonAdminUser,
    openDialogToEditPrice,
    savePrice,
    tryOpenDialogToEditPrice,
    typePrice,
    verifyDialog,
    verifyError,
    verifyHeader,
    verifyPriceAndStatusInRow,
    verifyRows,
    waitToTableIsLoaded,
} from "./ProductsPage.helpers";

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
        givenAProducts(mockWebServer);

        renderComponent(<ProductsPage />);

        await screen.findAllByRole("heading", { name: "Product price updater" });
    });

    describe("Table", () => {
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

            const [header, ...rows] = allRows;

            verifyHeader(header);

            verifyRows(rows, products);
        });
    });

    describe("Edit price", () => {
        test("should render a dialog when clicking on the edit button", async () => {
            const products = givenAProducts(mockWebServer);

            renderComponent(<ProductsPage />);

            await waitToTableIsLoaded();

            const dialog = await openDialogToEditPrice(0);

            verifyDialog(dialog, products[0]);
        });

        test("should show error message when trying to save with negative price", async () => {
            givenAProducts(mockWebServer);

            renderComponent(<ProductsPage />);

            await waitToTableIsLoaded();

            const dialog = await openDialogToEditPrice(0);

            await typePrice(dialog, "-4");

            await verifyError(dialog, "Invalid price format");
        });
        test("should show error message when trying to save with not number price", async () => {
            givenAProducts(mockWebServer);

            renderComponent(<ProductsPage />);

            await waitToTableIsLoaded();

            const dialog = await openDialogToEditPrice(0);

            await typePrice(dialog, "test");

            await verifyError(dialog, "Only numbers are allowed");
        });
        test("should show error message when trying to a prices greater than max", async () => {
            givenAProducts(mockWebServer);

            renderComponent(<ProductsPage />);

            await waitToTableIsLoaded();

            const dialog = await openDialogToEditPrice(0);

            await typePrice(dialog, "1000");

            await verifyError(dialog, "The max possible price is 999.99");
        });

        test("should edit price proper an mark status as 'active' for a price greater than zero", async () => {
            givenAProducts(mockWebServer);

            renderComponent(<ProductsPage />);

            await waitToTableIsLoaded();

            const dialog = await openDialogToEditPrice(0);

            const newPrice = "23.50";

            await typePrice(dialog, newPrice);

            await savePrice(dialog);

            await verifyPriceAndStatusInRow(0, newPrice, "active");
        });

        test("should edit price proper an mark status as 'inactive' for a price equal zero", async () => {
            givenAProducts(mockWebServer);

            renderComponent(<ProductsPage />);

            await waitToTableIsLoaded();

            const dialog = await openDialogToEditPrice(0);

            const newPrice = "0";

            await typePrice(dialog, newPrice);

            await savePrice(dialog);

            await verifyPriceAndStatusInRow(0, newPrice, "inactive");
        });

        test("should show error when try to edit price when user is non admin", async() => {
            givenAProducts(mockWebServer);

            renderComponent(<ProductsPage />);

            await waitToTableIsLoaded();

            await changeToNonAdminUser();

            await tryOpenDialogToEditPrice(0);

            await screen.findByText(/only admin users can edit the price of a product/i);
        });
    });
});

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
