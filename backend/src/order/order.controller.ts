import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  async create(@Query('fromCart') fromCart: string, @Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.create(createOrderDto, fromCart === 'true')
  }

  @Post('/merge-order')
  async mergeOrder(@Body() data: {userId: number}) {
    return await this.orderService.mergeOrder(+data.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/summary/:userId')
  async getOrderSummary (@Param('userId') userId: number){
    return this.orderService.getOrderSummary(userId)
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get('userId/:userId')
  findAllByUserIdAndStatus(@Param('userId') userId: number, @Query('status') status: string) {
    return this.orderService.findAllByUserIdAndStatus(userId, status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('src') src: string) {
    return await this.orderService.findOne(+id, src)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Patch('/status/:id')
  async updateOrderStatus(@Param('id') id: string, @Body() data: {status: string}) {
    return await this.orderService.updateOrderStatus(+id, data.status);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.orderService.remove(+id);
  }
}
