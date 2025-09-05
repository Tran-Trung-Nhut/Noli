export class CreateOrderItemDto {
    orderId?: number
    productId: number
    productVariantId: number
    quantity: number
    price: number
}
