import axiosClient from "./axiosClient";

const userApi = {
    getUserById: async (userId: number) => {
        try {
            return await axiosClient.get(`/user/${userId}`);
        } catch (error: any) {
            return error.response;
        }
    }
}

export default userApi;