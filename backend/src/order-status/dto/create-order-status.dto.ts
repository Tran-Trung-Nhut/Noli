import { Type } from "class-transformer"
import { IsInt, IsNotEmpty, IsString } from "class-validator"

export class CreateOrderStatusDto {
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    orderId: number

    @IsNotEmpty()
    @IsString()
    status: string
}
