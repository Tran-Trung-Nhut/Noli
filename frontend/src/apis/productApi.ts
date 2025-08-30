import axiosClient from "./axiosClient";
import { type CreateProduct } from "../dtos/product.dto";
import type { Paging } from "../dtos/paging.dto";
const productApi = {
    getPaging: async (paging: Paging) => {
        try {
            return await axiosClient.get("/product/paging",{
                params: paging
            });
        } catch (error: any) {
            return error.response;
        }
    },

    getProduct: async (id: number) => {
        try {
            return await axiosClient.get(`/product/${id}`);
        } catch (error: any) {
            return error.response;
        }
    },


    create : async (product: CreateProduct) => {
        try {
            return await axiosClient.post("/product", product);}
        catch (error: any) {
            return error.response
        }
    },

    update : async (product: Omit<CreateProduct, 'productVariants'>, productId: number) => {
        try{
            return await axiosClient.patch(`product/${productId}`, product)
        }catch(error: any){
            return error.response
        }
    },

    delete: async (id: number) => {
        try {
            return await axiosClient.delete(`/product/${id}`);
        } catch (error: any) {
            return error.response
        }
    }
};

export default productApi;
