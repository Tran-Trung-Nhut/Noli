export type Order = {
    id: number
    userId?: number
    guestToken?: string
    paymentMethod?: string
    transactionId?: string
    paymentStatus: string
    subTotal: number
    shippingFee: number
    discountAmount: number
    totalAmount: number
    currency: string
    addressId: number
    note?: string
    createdAt: Date
    updatedAt: Date
}

export type OrderInList = Omit<
    Order,
    'note' |
    'guestToken' |
    'transactionId' |
    'paymentMethod' |
    'subTotal' |
    'shippingFee' |
    'discountAmount' |
    'currency' |
    'addressId' |
    'updatedAt'
> & {
    customerFirstName: string
    customerLastName: string
    customerImage: string | null
    status: string
}