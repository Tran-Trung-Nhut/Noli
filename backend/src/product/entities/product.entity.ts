import { PartialType } from "@nestjs/mapped-types";

export class Product {
    id: number;
    defaultPrice: number;
    name: string;
    description: string;
    image: string[];
    category: string[];
    
    constructor(id: number, price: number, name: string, description: string, image: string[], category: string[]) {
        this.id = id;
        this.defaultPrice = price;
        this.name = name;
        this.description = description;
        this.image = image;
        this.category = category;
    }
}

export class LowAvailibleProduct extends PartialType(Product){
    status: string;
    totalProduct: number
}