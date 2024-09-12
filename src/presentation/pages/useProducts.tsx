import { useCallback, useEffect, useState } from "react";
import { GetProductByIdUseCase } from "../../domain/GetProductByIdUseCase";
import { GetProductsUseCase } from "../../domain/GetProductsUseCase";
import { Product } from "../../domain/Product";
import { useAppContext } from "../context/useAppContext";
import { useReload } from "../hooks/useReload";
import { ResourceNotFoundError } from "../../domain/ProductRepository";
import { Price, ValidationError } from "../../domain/Price";

export function useProducts(
    getProductsUseCase: GetProductsUseCase,
    getProductByIdUseCase: GetProductByIdUseCase
) {
    const [reloadKey, reload] = useReload();

    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [error, setError] = useState<string>();
    const [priceError, setPriceError] = useState<string | undefined>(undefined);

    const { currentUser } = useAppContext();

    useEffect(() => {
        getProductsUseCase.execute().then(products => {
            console.debug("Reloading", reloadKey);
            setProducts(products);
        });
    }, [reloadKey, getProductsUseCase]);

    const updatingQuantity = useCallback(
        async (id: number) => {
            if (id) {
                if (!currentUser.isAdmin) {
                    setError("Only admin users can edit the price of a product");
                    return;
                }

                try {
                    const product = await getProductByIdUseCase.execute(id);
                    setEditingProduct(product);
                } catch (error) {
                    if (error instanceof ResourceNotFoundError) {
                        setError(error.message);
                    } else {
                        setError("An error occurred while updating the product");
                    }
                }
            }
        },
        [currentUser.isAdmin, getProductByIdUseCase]
    );

    const cancelEditPrice = useCallback(() => {
        setEditingProduct(undefined);
    }, [setEditingProduct]);

    function onChangePrice(price: string): void {
        if (!editingProduct) return;

        try {
            setEditingProduct({ ...editingProduct, price: price });

            Price.create(price);

            setPriceError(undefined);
        } catch (error) {
            if (error instanceof ValidationError) {
                setPriceError(error.message);
            } else {
                setPriceError("An error occurred while updating the price");
            }
        }
    }

    return {
        reload,
        products,
        updatingQuantity,
        editingProduct,
        setEditingProduct,
        error,
        cancelEditPrice,
        onChangePrice,
        priceError,
    };
}
