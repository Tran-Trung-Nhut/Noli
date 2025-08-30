export type InvoiceProduct = {
    id: number,
    invoiceId: number,
    productReferralId: number,
    productName: string,
    productColor: string,
    productSize: string,
    productPrice: number,
    productQuantity: number,
    createdAt?: Date,
    updatedAt?: Date
}