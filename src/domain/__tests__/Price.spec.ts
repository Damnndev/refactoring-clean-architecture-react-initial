import { describe, expect, test } from "vitest";
import { Price } from "../Price";

describe("Price", () => {
    test("should create a price if validations are ok", () => {
        const price = Price.create("100");

        expect(price.value).toBeTruthy();
    });

    test("should throw error on negative prices", () => {
        expect(() => Price.create("-40.5")).toThrowError("Invalid price format");
    });

    test("should throw error for not number prices", () => {
        expect(() => Price.create("afs")).toThrowError("Only numbers are allowed");
    });

    test("should throw error when price greater than max", () => {
        expect(() => Price.create("1000.5")).toThrowError("The max possible price is 999.99");
    });
});
