import axiosClient from "./axios.client";

export const orderApi = {
  getTotal: async (status?: string) => {
    return axiosClient.get(`/order/total?status=${status}`);
  },

  getAll: async (
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: string,
    search: string
  ) => {
    return axiosClient.get('/order', {
      params: {
        page,
        limit,
        sortBy,
        sortOrder,
        search
      }
    });
  },
};