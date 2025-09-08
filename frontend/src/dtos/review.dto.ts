export type Review = {
    id: number;
    userId: number;
    productId: number;
    rating: number; 
    text?: string;
    images: string[],
    createdAt: Date;
    updatedAt:Date
};
