import axiosClient from "./axios.client";
const paymentApi = {
    async momo (body: {amount: number, orderId: string}){
        try {
            return await axiosClient.post('/payment/momo', body)
        } catch (error: any) {
            return error.response;
        }
    },

    async cod (orderId: number, orderStatus: string){
        try{
            return await axiosClient.post('/payment/cod', {orderId, orderStatus})
        }catch(error: any){
            return error.response
        }
    }

    
};

export default paymentApi;
