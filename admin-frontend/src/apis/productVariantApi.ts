import axiosClient from "./axiosClient";
import { CreateProductVariant } from "../dtos/productVariant.dto";

const productVariantApi = {
    getAllByProductId: async (productId: number) => {
        try {
            return await axiosClient.get(`/product-variant/${productId}`);
        } catch (error: any) {
            return error.response?.data;
        }
    },

    create : async (variant: CreateProductVariant, productId: number) => {
        try {
            return await axiosClient.post(`/product-variant/${productId}`, variant);}
        catch (error: any) {
            return error.response?.data
        }
    },

    update : async (editVariant: CreateProductVariant, variantId: number) => {
        try {
            return await axiosClient.patch(`/product-variant/${variantId}`, editVariant);
        } catch (error: any) {
            return error.response?.data
        }
    },

    delete: async (id: number) => {
        try {
            return await axiosClient.delete(`/product-variant/${id}`);
        } catch (error: any) {
            return error.response?.data;
        }
    }
};

export default productVariantApi;
