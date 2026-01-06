import type { CreateAddressDto, UpdateAddressDto } from "../dtos/address.dto";
import axiosClient from "./axios.client";

const addressApi = {
    getListProvinces: async () => {
        try {
            return await axiosClient.get("/address/provinces");
        } catch (error: any) {
            return error.response;
        }
    },

    getListDistricts: async (provinceId: string) => {
        try {
            return await axiosClient.get(`/address/districts/${provinceId}`);
        } catch (error: any) {
            return error.response;
        }
    },

    getListWards: async (districtId: string) => {
        try {
            return await axiosClient.get(`/address/wards/${districtId}`);
        }
        catch (error: any) {
            return error.response;
        }
    },

    getListAddressByUserId: async (userId: number) => {
        try {
            return await axiosClient.get(`/address/user/${userId}`);
        } catch (error: any){
            return error.response;
        }
    },

    createAddress: async (data: CreateAddressDto) => {
        try {
            return await axiosClient.post('/address', data);
        } catch (error: any) {
            return error.response;
        }
    },

    updateAddress: async (id: number, data: UpdateAddressDto) => {
        try{
            return await axiosClient.patch(`/address/${id}`, data)
        } catch(error: any){
            return error.response
        }
    },

    deleteAddress: async (id: number) => {
        try {
            return await axiosClient.delete(`/address/${id}`)
        } catch (error: any) {
            return error.response
        }
    }
};

export default addressApi;