import { Product } from "../domain/Product";
import { ProductRepository, ResourceNotFoundError } from "../domain/ProductRepository";
import { RemoteProduct, StoreApi } from "./api/StoreApi";

export class ProductApiRepository implements ProductRepository {
    constructor(private storeApi: StoreApi) {}

    async getAll(): Promise<Product[]> {
        const remoteProducts = await this.storeApi.getAll();

        return remoteProducts.map(buildProduct);
    }

    async getById(id: number): Promise<Product> {
        try {
            const remoteProduct = await this.storeApi.get(id);

            return buildProduct(remoteProduct);
        } catch (error) {
            throw new ResourceNotFoundError(`Product with id ${id} not found`);
        }
    }
}

function buildProduct(remoteProduct: RemoteProduct): Product {
    return Product.create({
        id: remoteProduct.id,
        title: remoteProduct.title,
        image: remoteProduct.image,
        price: remoteProduct.price.toString(),
    });
}
