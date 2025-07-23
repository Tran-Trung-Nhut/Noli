export class CreateProductVariantDto {
    color: string;
    size: string;
    price: number;
    stock: number;

    constructor(color: string, size: string, price: number, stock: number) {
        this.color = color;
        this.size = size;
        this.price = price;
        this.stock = stock;
    }
}
