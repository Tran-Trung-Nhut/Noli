import { Type } from "class-transformer"
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateReviewDto {
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    userId: number
    
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    productId: number

    @IsOptional()
    @IsString()
    text?: string

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    rating: number
}
