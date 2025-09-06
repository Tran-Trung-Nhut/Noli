import { CreateOrderItemDto } from "src/order-item/dto/create-order-item.dto";

export class CreateOrderDto {
    userId?: number;
    guestToken?: string;
    status?: string;
    paymentStatus?: string
    subTotal: number;
    shippingFee: number;
    discount?: number;
    totalAmount: number;
    addressId: number;
    note?: string;
    email?: string;
    paymentMethod: string;
    transactionId?: string

    orderItems: CreateOrderItemDto[]
}
