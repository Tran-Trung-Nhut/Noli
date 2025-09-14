import { Type } from "class-transformer";
import { IsArray, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateOrderItemDto } from "src/order-item/dto/create-order-item.dto";

export class CreateOrderDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    userId?: number;

    @IsOptional()
    @IsString()
    guestToken?: string;

    @IsOptional()
    @IsString()
    paymentStatus?: string

    @IsNumber()
    @Type(() => Number)
    subTotal: number;

    @IsNumber()
    @Type(() => Number)
    shippingFee: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    discount?: number;

    @IsNumber()
    @Type(() => Number)
    totalAmount: number;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    addressId: number;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsString()
    transactionId?: string

    @IsArray()
    orderItems: CreateOrderItemDto[]
}
