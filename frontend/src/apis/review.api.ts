import axiosClient from "./axios.client"

export const reviewApi = {
    async getRevewByProductId(productId: number) {
        try {
            return await axiosClient.get(`/review/productId/${productId}`)
        } catch (error: any) {
            return error.response
        }
    },

    async createReview(formData: FormData, onProgress?: (percent: number) => void) {
        try {
            return await axiosClient.post('/review', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (!progressEvent.total) return;
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    if (onProgress) onProgress(percent);
                },
            })
        } catch (error: any) {
            return error.response
        }
    },

    async deleteReview(id: number) {
        try {
            return await axiosClient.delete(`/review/${id}`)
        } catch (error: any) {
            return error.response
        }
    }
}