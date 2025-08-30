import type { CreateCartItem } from "../dtos/cartItem.dto";
import axiosClient from "./axiosClient";

const cartItemApi = {
    async addItemToCart(body: CreateCartItem) {
        try {
            return await axiosClient.post('/cart-item', body);
        } catch (error: any) {
            return error.response;
        }
    },

    async removeFromCart(id: number) {
        try {
            return await axiosClient.delete(`/cart-item/${id}`);
        } catch (error: any) {
            return error.response;
        }
    }
}

export default cartItemApi