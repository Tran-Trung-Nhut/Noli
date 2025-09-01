import type { UpdateUserDto } from "../dtos/user.dto";
import axiosClient from "./axiosClient";

const userApi = {
    getUserById: async (userId: number) => {
        try {
            return await axiosClient.get(`/user/${userId}`);
        } catch (error: any) {
            return error.response;
        }
    },

    updateUser: async (userId: number, userData: UpdateUserDto) => {
        try {
            return await axiosClient.patch(`/user/${userId}`, userData);
        } catch (error: any) {
            return error.response;
        }
    },
}

export default userApi;