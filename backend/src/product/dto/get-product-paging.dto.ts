import { Optional } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class GetProductPagingDto {

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page: number;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    limit: number;

    @IsNotEmpty()
    @IsString()
    sortBy: string;

    @IsNotEmpty()
    @IsIn(['asc', 'desc'])
    sortOrder: 'asc' | 'desc';

    @IsOptional()
    @IsString()
    search?: string;

    @Optional()
    category?: string | null;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    maxPrice?: number | null;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    minPrice?: number | null;
}
