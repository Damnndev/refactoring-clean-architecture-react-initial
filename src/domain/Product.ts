import { Entity } from "./core/Entity";
import { Price } from "./Price";

export interface ProductData {
    id: number;
    title: string;
    image: string;
    price: string;
}

type ProductEntityData = Omit<ProductData, "price"> & {
    price: Price,
    status: ProductStatus
};

export type ProductStatus = "active" | "inactive";

export class Product extends Entity {
    public readonly id: number;
    public readonly title: string;
    public readonly image: string;
    public readonly price: Price;
    public readonly status: ProductStatus;

    private constructor(data: ProductEntityData) {
        super(data.id);

        this.id = data.id;
        this.title = data.title;
        this.image = data.image;
        this.price = data.price;
        this.status = data.status;
    }

    public static create(data: ProductData): Product {
        const price = Price.create(data.price);

        return new Product({ ...data, price, status: price.value === 0 ? "inactive" : "active" });
    }
}
