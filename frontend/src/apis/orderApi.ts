import type { CreateOrderDto } from "../dtos/order.dto"
import axiosClient from "./axiosClient"

const orderApi = {
    async createOrder(order: CreateOrderDto, fromCart: boolean) {
        try{
            return await axiosClient.post('/order', order, {
                params: fromCart
            })
        }catch(error: any){
            return error.response
        }
    }
}

export default orderApi