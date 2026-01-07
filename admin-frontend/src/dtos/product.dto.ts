import { CreateProductVariant } from "./product-variant.dto"

export type Product = {
    id: number,
    defaultPrice: number,
    name: string,
    description: string,
    image: string[],
    category: string[],
    soldQuantity?: number,
    createdAt?: Date,
    updatedAt?: Date,
}

export type CreateProduct = Omit<Product, 'id'> & {productVariants: CreateProductVariant[]}

export type LowAvailibleProduct = Omit<Product, 'defaultPrice' | 'description' | 'image'> & {status: string, totalProduct: number}

export const defaultProduct : Product = {
    id: 0,
    defaultPrice: 0,
    description: "Đây là mô tả sản phẩm mặc định",
    name: "Sản phẩm mặc định",
    image: [],
    category: []
}