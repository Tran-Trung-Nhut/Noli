import { Role } from "../enums/role.enum"

export type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  email: string;
  image: string;
  gender: string;
  role: Role;
  registeredAt: Date;
  lastLogin: Date;
  refreshToken: string;
}

export type UserInList = Omit<User, 'dateOfBirth' | 'refreshToken' | 'gender' | 'role' | 'username'>;
