import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CreateProductVariantDto } from "src/product-variant/dto/create-product-variant.dto";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    defaultPrice: number;

    @IsArray()
    image: string[];

    @IsArray()
    category: string[];

    @IsArray()
    productVariants: CreateProductVariantDto[];
}
