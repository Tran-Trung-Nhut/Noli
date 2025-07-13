export type CartProduct = {
    userId: number,
    productId: number,
    quantity: number,
    createdAt: Date,
    updatedAt: Date,
}

export const defaultCartProduct: CartProduct = {
    userId: 0,
    productId: 0,
    quantity: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
}