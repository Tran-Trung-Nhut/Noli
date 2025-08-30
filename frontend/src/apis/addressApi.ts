import axiosClient from "./axiosClient";

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
    }
};

export default addressApi;