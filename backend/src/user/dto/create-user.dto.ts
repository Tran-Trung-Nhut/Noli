import { IsOptional, IsString } from "class-validator"

export class CreateUserDto {
    @IsString()
    username: string

    @IsString()
    password: string
    
    @IsString()
    firstName: string
    
    @IsString()
    lastName: string
    
    @IsOptional()
    dateOfBirth: Date | null
    
    @IsOptional()
    @IsString()
    phoneNumber: string | null

    @IsOptional()
    @IsString()
    email: string | null
    
    @IsOptional()
    @IsString()
    gender: string | null
}
