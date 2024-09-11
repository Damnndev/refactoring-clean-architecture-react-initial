import { Product } from "./Product";

export class ResourceNotFoundError extends Error {}
export interface ProductRepository {
    getAll(): Promise<Product[]>;
    getById(id: number): Promise<Product>;
}
