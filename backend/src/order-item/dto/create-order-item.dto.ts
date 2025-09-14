import { Type } from "class-transformer"
import { IsInt, IsNotEmpty, IsNumber, IsOptional } from "class-validator"

export class CreateOrderItemDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    orderId?: number

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    productId: number

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    productVariantId: number

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    quantity: number

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    price: number
}
