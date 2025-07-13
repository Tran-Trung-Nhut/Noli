import type { Product } from "../dtos/Product.dto"
import { products } from "../mocks/product"

export const getProductInformation = (productId: number): Product | undefined => {
    return products.find(product => product.id === productId);
};