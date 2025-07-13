export type ProductInCart = {
    productId: number,
    userId: number,
    quatity: number,
    addedAt: Date,
    updatedAt: Date
}

export const defaultProductInCart : ProductInCart = {
    productId: 0,
    userId: 0,
    quatity: 0,
    addedAt: new Date(),
    updatedAt: new Date()
}