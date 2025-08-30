import type { Product } from "./product.dto"
import type { ProductVariant } from "./productVariant.dto"

export type CartItem = {
    id: number
    cartId: number
    productId: number
    productVariantId: number
    quantity: number
    priceAtAdding: number
    createdAt: Date
    updatedAt: Date
}

export type CreateCartItem = Omit<CartItem, 'id' | 'createdAt' | 'updatedAt' | 'cartId'> & {guestToken: string | null}

export type CartItemShowOnCart = CartItem & {productVariant: ProductVariant, product: Product}
