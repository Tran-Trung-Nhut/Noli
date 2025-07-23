import axiosClient from "./axiosClient";
import { CreateProduct } from "../dtos/product.dto";
import { Paging } from "../dtos/paging.dto";

const productApi = {
    getPaging: async (paging: Paging) => {
        try {
            return await axiosClient.get("/product/paging",{
                params: paging
            });
        } catch (error: any) {
            return error.response?.data;
        }
    },

    getLowAvailiblePaging: async (paging: Paging) => {
        try{
            return await axiosClient.get("/product/low-availible-paging",{
                params: paging
            })
        }catch (error: any){
            return error.response?.data
        }
    },

    create : async (product: CreateProduct) => {
        try {
            return await axiosClient.post("/product", product);}
        catch (error: any) {
            return error.response?.data
        }
    },

    update : async (product: Omit<CreateProduct, 'productVariants'>, productId: number) => {
        try{
            return await axiosClient.patch(`product/${productId}`, product)
        }catch(error: any){
            return error.response?.data
        }
    },

    delete: async (id: number) => {
        try {
            return await axiosClient.delete(`/product/${id}`);
        } catch (error: any) {
            return error.response?.data;
        }
    }
};

export default productApi;
