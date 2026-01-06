import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderStatusDto } from './dto/create-order-status.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderStatusService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createOrderStatusDto: CreateOrderStatusDto) {
    try {
      const existOrder = await this.prismaService.order.findUnique({ where: { id: createOrderStatusDto.orderId } })

      if (!existOrder) throw new BadRequestException("Đơn hàng không tồn tại")

      const currentStatus = await this.prismaService.orderStatus.findFirst({ where: { orderId: existOrder.id, isCurrentStatus: true } })

      if (!currentStatus) {
        return await this.prismaService.orderStatus.create({ data: createOrderStatusDto })
      } else {
        return await this.prismaService.$transaction(async (prisma) => {
          await prisma.orderStatus.updateMany({ where: { orderId: existOrder.id, isCurrentStatus: true }, data: { isCurrentStatus: false } })

          const orderStatus = await prisma.orderStatus.create({
            data: {
              orderId: createOrderStatusDto.orderId,
              status: createOrderStatusDto.status,
              previousStatusId: currentStatus.id
            }
          })
          return orderStatus
        })
      }
    } catch (error) {
      console.error(error)
      
      if (!(error instanceof InternalServerErrorException)) {
        throw error
      }
      throw new InternalServerErrorException(error)
    }
  }

  findAll() {
    return `This action returns all orderStatus`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderStatus`;
  }

  update(id: number, updateOrderStatusDto: UpdateOrderStatusDto) {
    return `This action updates a #${id} orderStatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderStatus`;
  }
}
