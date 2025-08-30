import axiosClient from "./axiosClient";

const cartApi = {
    async getCartByGuestToken(guest_token: string) {
        try {
            return await axiosClient.get(`/cart/guest/${guest_token}`);
        } catch (error: any) {
            return error.response;
        }
    },

    async getCartItemsByUserId(userId: number) {
        try {
            return await axiosClient.get(`/cart/user/${userId}`);
        } catch (error: any) {
            return error.response;
        }
    },

    async getCartByUserId(userId: number) {
        try {
            return await axiosClient.get(`/cart/loged-in/${userId}`);
        } catch (error: any) {
            return error.response;
        }
    },

    async isCartOwnedByUser(guestToken: string, userId: number) {
        try {
            return await axiosClient.post('/cart/is-owned-by-user', { guestToken, userId });
        } catch (error: any) {
            return error.response;
        }
    },

    async createCartForGuest(userId?: number) {
        try {
            return await axiosClient.post('/cart', { userId });
        } catch (error: any) {
            return error.response;
        }
    },

    async mergeCart(guestToken: string | null, userId: number) {
        try {
            return await axiosClient.post('/cart/merge-cart', { guestToken, userId });
        } catch (error: any) {
            return error.response;
        }
    },
}

export default cartApi