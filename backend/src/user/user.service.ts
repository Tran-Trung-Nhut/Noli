import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MESSAGES } from 'src/constantsAndMessage';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) { }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    return await this.prismaService.user.findUnique({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prismaService.user.findUnique({ where: { id } });
    if (!existingUser) throw new BadRequestException(MESSAGES.USER.ERROR.NOT_FOUND);
    return await this.prismaService.user.update({
      where: { id }, data: {
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        phoneNumber: updateUserDto.phoneNumber,
        email: updateUserDto.email,
        dateOfBirth: updateUserDto.dateOfBirth ? new Date(updateUserDto.dateOfBirth) : null,
        gender: updateUserDto.gender
      }
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
