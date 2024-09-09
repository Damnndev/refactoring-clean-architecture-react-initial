import { within, screen, waitFor } from "@testing-library/react";
import { expect } from "vitest";
import { RemoteProduct } from "../../../../data/api/StoreApi";
import { userEvent } from "@testing-library/user-event";

export function verifyHeader(headerRow: HTMLElement) {
    const headerScope = within(headerRow);

    const cells = headerScope.getAllByRole("columnheader");

    expect(cells.length).toBe(6);

    within(cells[0]).getByText("ID");
    within(cells[1]).getByText("Title");
    within(cells[2]).getByText("Image");
    within(cells[3]).getByText("Price");
    within(cells[4]).getByText("Status");
}

export async function waitToTableIsLoaded() {
    await waitFor(async () =>
        expect((await screen.findAllByRole("row")).length).toBeGreaterThan(1)
    );
}

export function verifyRows(rows: HTMLElement[], products: RemoteProduct[]) {
    expect(rows.length).toBe(products.length);

    rows.forEach((row, index) => {
        const rowScope = within(row);

        const cells = rowScope.getAllByRole("cell");

        expect(cells.length).toBe(6);

        const product = products[index];

        within(cells[0]).getByText(product.id);
        within(cells[1]).getByText(product.title);

        const image: HTMLImageElement = within(cells[2]).getByRole("img");
        expect(image.src).toBe(product.image);

        within(cells[3]).getByText(`$${product.price.toFixed(2)}`);
        within(cells[4]).getByText(product.price === 0 ? "inactive" : "active");
    });
}

export async function openDialogToEditPrice(index: number): Promise<HTMLElement> {
    await tryOpenDialogToEditPrice(index);

    return await screen.findByRole("dialog");
}

export function verifyDialog(dialog: HTMLElement, product: RemoteProduct) {
    const dialogScope = within(dialog);

    const image: HTMLImageElement = dialogScope.getByRole("img");
    expect(image.src).toBe(product.image);

    dialogScope.getByText(product.title);

    expect(dialogScope.getByDisplayValue(product.price));
}

export async function typePrice(dialog: HTMLElement, price: string) {
    const dialogScope = within(dialog);

    const priceTextBox = dialogScope.getByRole("textbox", { name: /price/i });

    await userEvent.clear(priceTextBox);
    await userEvent.type(priceTextBox, price);
}

export async function verifyError(dialog: HTMLElement, error: string) {
    const dialogScope = within(dialog);

    await dialogScope.findByText(error);
}

export async function savePrice(dialog: HTMLElement) {
    const dialogScope = within(dialog);

    const saveButton = dialogScope.getByRole("button", { name: /save/i });

    await userEvent.click(saveButton);
}

export async function verifyPriceAndStatusInRow(index: number, newPrice: string, status: string) {
    const allRows = await screen.findAllByRole("row");

    const [, ...rows] = allRows;

    const row = rows[index];

    const rowScope = within(row);

    const cells = rowScope.getAllByRole("cell");

    within(cells[3]).getByText(`$${(+newPrice).toFixed(2)}`);
    within(cells[4]).getByText(status);
}

export async function changeToNonAdminUser() {
    await userEvent.click(screen.getByRole("button", { name: /user: admin user/i }));

    await userEvent.click(screen.getByRole("menuitem", { name: /non admin user/i }));
}

export async function tryOpenDialogToEditPrice(index: number) {
    const allRows = await screen.findAllByRole("row");

    const [, ...rows] = allRows;

    const row = rows[index];

    const rowScope = within(row);

    await userEvent.click(rowScope.getByRole("menuitem"));

    const updatePriceMenu = await screen.findByRole("menuitem", { name: /update price/i });

    await userEvent.click(updatePriceMenu);
}

export async function verifySaveBtnIsDisabled(dialog: HTMLElement) {
    const dialogScope = within(dialog);

    const saveButton = dialogScope.getByRole("button", { name: /save/i });

    // closest is used to to get the nearest father button element
    expect(saveButton.closest("button")).toBeDisabled();
}
