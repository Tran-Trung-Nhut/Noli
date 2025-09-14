import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAddressDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    userId?: number;

    @IsNotEmpty()
    @IsString()
    phone: string

    @IsNotEmpty()
    @IsString()
    provinceId: string

    @IsNotEmpty()
    @IsString()
    provinceName: string

    @IsNotEmpty()
    @IsString()
    districtId: string

    @IsNotEmpty()
    @IsString()
    districtName: string

    @IsNotEmpty()
    @IsString()
    wardId: string

    @IsNotEmpty()
    @IsString()
    wardName: string

    @IsNotEmpty()
    @IsString()
    addressLine: string

    @IsNotEmpty()
    @IsString()
    fullName: string

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    isDefault?: boolean

    @IsOptional()
    @IsString()
    label?: string

    @IsOptional()
    @IsString()
    postalCode?: string

    @IsOptional()
    @IsEmail()
    email?: string
}
