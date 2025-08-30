import { Optional } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsString, Min } from "class-validator";

export class GetProductPagingDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number;

    @Type(() => Number)
    @IsInt()
    @Min(5)
    limit: number;

    sortBy: string;

    @IsIn(['asc', 'desc'])
    sortOrder: 'asc' | 'desc';

    @IsString()
    search: string;

    @IsString()
    @Optional()
    category?: string | null;

    @Type(() => Number)
    maxPrice?: number | null;

    @Type(() => Number)
    minPrice?: number | null;

    constructor(
        page: number, 
        limit: number, 
        sortBy: string, 
        sortOrder: 'asc' | 'desc', 
        search: string, 
        category?: string | null,
        maxPrice?: number | null,
        minPrice?: number | null
    ) {
        this.page = page;
        this.limit = limit;
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
        this.search = search;
        this.category = category || null;
        this.maxPrice = maxPrice || null;
        this.minPrice = minPrice || null;
    }

}
