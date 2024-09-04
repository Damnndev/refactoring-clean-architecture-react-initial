import { render, RenderResult, screen } from "@testing-library/react";
import { ReactNode } from "react";
import { test } from "vitest";
import { AppProvider } from "../../context/AppProvider";
import { ProductsPage } from "../ProductsPage";

test("Loads and displays title", async () => {
    renderComponent(<ProductsPage />);

    await screen.findAllByRole("heading", { name: "Product price updater" });
});

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
