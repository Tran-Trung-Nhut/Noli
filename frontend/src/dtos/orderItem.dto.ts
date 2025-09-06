import type { Product } from "./product.dto"
import type { ProductVariant } from "./productVariant.dto"

export type OrderItemDto = {
    id: number
    orderId?: number
    productId: number
    productVariantId: number
    quantity: number
    price: number
}

export type CreateOrderItemDto = Omit<OrderItemDto, 'id'>

export type OrderItemShow = OrderItemDto & {product: Product, productVariant: ProductVariant}