import axiosClient from "./axiosClient";
const paymentApi = {
    momo: async (body: {amount: number, orderId: string}) => {
        try {
            return await axiosClient.post('/payment/momo', body)
        } catch (error: any) {
            return error.response;
        }
    },

    
};

export default paymentApi;
