import { Type } from "class-transformer";
import { IsIn, IsInt, Min } from "class-validator";

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

    search: string;

    constructor(page: number, limit: number, sortBy: string, sortOrder: 'asc' | 'desc', search: string) {
        this.page = page;
        this.limit = limit;
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
        this.search = search;
    }

}
