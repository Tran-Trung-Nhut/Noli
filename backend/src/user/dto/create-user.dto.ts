import { Type } from "class-transformer"
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    firstName: string

    @IsNotEmpty()
    @IsString()
    lastName: string

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    dateOfBirth: Date | null

    @IsOptional()
    @IsString()
    phoneNumber: string | null

    @IsOptional()
    @IsEmail()
    email: string | null

    @IsOptional()
    @IsString()
    gender: string | null
}
