export class ProductVariant {
    id: number;
    productId: number;
    size: string;
    color: string;
    price: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: number, productId: number, size: string, color: string, price: number, stock: number, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.productId = productId;
        this.size = size;
        this.color = color;
        this.price = price;
        this.stock = stock;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
