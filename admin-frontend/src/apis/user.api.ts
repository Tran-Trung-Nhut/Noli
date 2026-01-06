import axiosClient from "./axios.client";

export const userApi = {
    getAll: async (
        page: number,
        limit: number,
        sortBy: string,
        sortOrder: 'asc' | 'desc',
        search?: string
    ) => {
        try {
            return await axiosClient.get("/user", {
                params: {
                    page,
                    limit,
                    sortBy,
                    sortOrder,
                    search
                }
            });
        } catch (error: any) {
            return error.response?.data;
        }
    },

    getTotal: async () => {
        try {
            return await axiosClient.get("/user/total");
        } catch (error: any) {
            return error.response?.data;
        }
    },
}