import { describe, expect, test } from "vitest";
import { Product } from "../Product";

describe("Product", () => {
    test("should create a product with status active if price gretaer than 0", () => {
        const product = Product.create({
            id: 1,
            title: "Product 1",
            image: "image.jpg",
            price: "100",
        });

        expect(product.status).toBe("active");
    });

    test("should create a product with status inactive if price equal 0", () => {
        const product = Product.create({
            id: 1,
            title: "Product 1",
            image: "image.jpg",
            price: "0",
        });

        expect(product.status).toBe("inactive");
    });
});
