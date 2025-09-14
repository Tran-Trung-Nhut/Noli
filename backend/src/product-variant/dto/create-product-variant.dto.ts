import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductVariantDto {
    @IsNotEmpty()
    @IsString()
    color: string;

    @IsNotEmpty()
    @IsString()
    size: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    price: number;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    stock: number;
}
