import axiosClient from "./axiosClient"

export const reviewApi = {
    async getRevewByProductId(productId: number) {
        try {
            return await axiosClient.get(`/review/productId/${productId}`)
        } catch (error: any) {
            return error.response
        }
    },

    async createReview(formData: FormData) {
        try {
            return await axiosClient.post('/review', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
        } catch (error: any) {
            return error.response
        }
    }
}