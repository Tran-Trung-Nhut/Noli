import type { CreateCartItem } from "../dtos/cartItem.dto";
import axiosClient from "./axios.client";

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
    },

    async getCountByUserId (userId: number) {
        try {
            return await axiosClient.get(`/cart-item/count/userId/${userId}`)
        } catch (error:any) {
            return error.response
        }
    },

    async getCountByGuestToken (guestToken: string){
        try {
            return await axiosClient.get(`/cart-item/count/guestToken/${guestToken}`)
        } catch (error:any) {
            return error.response
        }
    }
}

export default cartItemApi