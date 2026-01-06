import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MESSAGES } from 'src/constantsAndMessage';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) { }

  async getAll(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    search?: string
  ) {
    try {
      const condition = { role: Role.USER}

      if(search){
        Object.assign(condition, {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        })
      }

      return await this.prismaService.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          registeredAt: true,
          image: true,
        },
        skip: Number((page - 1) * limit),
        take: Number(limit),
        orderBy: { [sortBy === 'name' ? 'firstName' : sortBy]: sortOrder },
        where: condition
      });
    } catch (error) {
      console.error(error)

      if (!(error instanceof InternalServerErrorException)) {
        throw error
      }
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: number) {
    try {
      return await this.prismaService.user.findUnique({
        where: { id },
        omit: {
          password: true,
          refreshToken: true,
        }
      });
    } catch (error) {
      console.error(error)

      if (!(error instanceof InternalServerErrorException)) {
        throw error
      }
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
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
    } catch (error) {
      console.error(error)

      if (!(error instanceof InternalServerErrorException)) {
        throw error
      }
      throw new InternalServerErrorException(error)
    }
  }

  async getTotal() {
    try {
      return await this.prismaService.user.count({
        where: {
          role: Role.USER
        }
      });
    } catch (error) {
      console.error(error)

      if (!(error instanceof InternalServerErrorException)) {
        throw error
      }
      throw new InternalServerErrorException(error)
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
