export type OrderItemDto = {
    id: number
    orderId?: number
    productId: number
    productVariantId: number
    quantity: number
    price: number
}

export type CreateOrderItemDto = Omit<OrderItemDto, 'id'>