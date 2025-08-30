export class User {
    id: number;
    username: string
    firstName: string;
    lastName: string;
    email: string | null;
    phoneNumber: string | null;
    dateOfBirth: Date | null
    image: string | null;
    registeredAt: Date
    lastLogin: Date
}

