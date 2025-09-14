import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class CreateCartDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    userId?: number;
}
