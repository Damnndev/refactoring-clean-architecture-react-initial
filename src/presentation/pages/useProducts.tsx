import { useEffect, useState } from "react";
import { GetProductsUseCase } from "../../domain/GetProductsUseCase";
import { Product } from "../../domain/Product";
import { useReload } from "../hooks/useReload";

export function useProducts(getProductsUseCase: GetProductsUseCase) {
    const [reloadKey, reload] = useReload();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        getProductsUseCase.execute().then(products => {
            console.debug("Reloading", reloadKey);
            setProducts(products);
        });
    }, [reloadKey, getProductsUseCase]);

    return {
        reload,
        products,
    };
}
