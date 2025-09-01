export class CreateUserDto {
    username: string
    password: string
    firstName: string
    lastName: string
    dateOfBirth: Date | null
    phoneNumber: string | null
    email: string | null
}
