import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMomoPaymentDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    amount: number

    @IsNotEmpty()
    @IsString()
    orderId: string
}
