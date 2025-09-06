import type { CreateOrderDto, UpdateOrder } from "../dtos/order.dto"
import axiosClient from "./axiosClient"

const orderApi = {
    async createOrder(order: CreateOrderDto, fromCart: boolean) {
        try{
            return await axiosClient.post('/order', order, {
                params: {fromCart}
            })
        }catch(error: any){
            return error.response
        }
    },


    async getOrderSummary(userId: number) {
        try {
            return await axiosClient.get(`/order/summary/${userId}`)
        } catch (error: any) {
            return error.response
        }
    },

    async getOrderAndOrderItems (id: number){
        try {
            return await axiosClient.get(`/order/${id}`)
        } catch (error: any) {
            return error.response            
        }
    },

    async getOrderByUserId (userId: number, status: string) {
        try {
            return await axiosClient.get(`/order/userId/${userId}`, {
                params: {status}
            })
        } catch (error: any) {
            return error.response   
        }
    },

    async getOrder (id: number) {
        try {
            return await axiosClient.get(`/order/${id}`)
        } catch (error: any) {
            return error.response
        }
    },

    async updateOrder (id: number, data: UpdateOrder){
        try {
            return await axiosClient.patch(`/order/${id}`, data)
        } catch (error: any) {
            return error.response
        }
    },

    async updateOrderStatus(id: number, status: string) {
        try {
            return await axiosClient.patch(`/order/status/${id}`, {status})
        } catch (error: any) {
            return error.response
        }
    }
}

export default orderApi