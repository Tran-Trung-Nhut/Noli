import axiosClient from "./axios.client";

const authApi = {

    refresh: async () => {
        try {
            return await axiosClient.post("/auth/refresh");
        } catch (error: any) {
            return error.response
        }
    },

    ping: async () => {
        try {
            return await axiosClient.get("/auth/ping");
        } catch (error: any) {
            return error.response
        }  
    },


    login: async (username: string, password: string) => {
        try {
            return await axiosClient.post("/auth/login", { username, password });
        } catch (error: any) {
            return error.response
        }
    },

    googleLogin: async () => {
        try {
            return await axiosClient.get("/auth/google");
        } catch (error: any) {
            return error.response
        }
    },

    logout: async (userId: number) => {
        try {
            return await axiosClient.post("/auth/logout", { userId });
        } catch (error: any) {
            return error.response
        }
    }
}

export default authApi;