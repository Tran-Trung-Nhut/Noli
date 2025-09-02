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
}
