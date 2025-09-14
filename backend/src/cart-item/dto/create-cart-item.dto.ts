import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCartItemDto {
    @IsNotEmpty()
    @IsString()
    guestToken: string;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    productId: number;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    productVariantId: number;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    priceAtAdding: number;
}
