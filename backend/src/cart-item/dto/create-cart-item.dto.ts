export class CreateCartItemDto {
    guestToken: string;
    productId: number;
    productVariantId: number;
    quantity: number;
    priceAtAdding: number;
}
