import type { CreateOrderItemDto, OrderItemShow } from "./orderItem.dto"

export type OrderDto = {
    id: number
    userId?: number
    guestToken?: string
    status: string
    paymentStatus?: string
    subTotal: number
    shippingFee: number
    discountAmount: number
    totalAmount: number
    currency: string
    addressId: number
    paymentMethod?: string
    note?: string
    createdAt: Date
    updatedAt: Date
}

export type CreateOrderDto = Omit<OrderDto, 'id' | 'paymentStatus' | 'currency' | 'createdAt' | 'updatedAt'> & {orderItems: CreateOrderItemDto[]}

export type OrderShowDto = OrderDto & {orderItems: OrderItemShow[]}

export type UpdateOrder = Omit<OrderDto, 'id' | 'currency' | 'createdAt' | 'updatedAt'>