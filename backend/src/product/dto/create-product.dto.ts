import { CreateProductVariantDto } from "src/product-variant/dto/create-product-variant.dto";

export class CreateProductDto {
    id: number;
    name: string;
    description: string;
    defaultPrice: number;
    image: string[];
    category: string[];
    productVariants: CreateProductVariantDto[];
}
