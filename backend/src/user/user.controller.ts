import { Controller, Get, Body, Patch, Param, Delete, Res, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { MESSAGES } from 'src/constantsAndMessage';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/shares/decorators/role.decorator';
import { Role } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAll(
    @Res() res,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc',
    @Query('search') search?: string
  ) {
    try {
      return res.status(HttpStatus.OK).json({
        data: await this.userService.getAll(
          page,
          limit,
          sortBy,
          sortOrder,
          search
        ),
      });
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Get('/total')
  async getTotal() {
    return await this.userService.getTotal();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      return res.status(HttpStatus.OK).json({ data: await this.userService.findOne(+id) });
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res) {
    try {
      await this.userService.update(+id, updateUserDto) 
      return res.status(HttpStatus.OK).json({ message: MESSAGES.USER.SUCCESS.UPDATE});
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
