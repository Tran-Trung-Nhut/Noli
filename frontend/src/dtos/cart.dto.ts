import type { CartItemShowOnCart } from "./cartItem.dto"

export type Cart = {
    id: number
    userId: number | null
    guestToken: string
    totalAmount: number
    numberOfItems: number
    createdAt: Date
    updatedAt: Date
    status: string
    cartItems: CartItemShowOnCart[]
}