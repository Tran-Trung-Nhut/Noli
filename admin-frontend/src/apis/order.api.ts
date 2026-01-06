import axiosClient from "./axios.client";

export const orderApi = {
  getTotal: (status?: string) => {
    return axiosClient.get(`/order/total?status=${status}`);
  },
};