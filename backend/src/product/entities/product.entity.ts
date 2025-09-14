import { PartialType } from "@nestjs/mapped-types";

export class Product {
    id: number;
    defaultPrice: number;
    name: string;
    description: string;
    image: string[];
    category: string[];
}

export class LowAvailibleProduct extends PartialType(Product){
    status: string;
    totalProduct: number
}