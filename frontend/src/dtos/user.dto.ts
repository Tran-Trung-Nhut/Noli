export type UserDto = {
    id: number
    username: string
    firstName: string
    lastName: string
    dateOfBirth: Date | null
    phoneNumber: string | null
    email: string | null
    image: string | null
    registeredAt: Date
    lastLogin: Date
}

export type UpdateUserDto = Omit<UserDto, 'id' | 'username' | 'registeredAt' | 'lastLogin' | 'image'>
