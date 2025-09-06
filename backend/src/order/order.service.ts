import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MESSAGES } from 'src/constantsAndMessage';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) { }

  async create(createOrderDto: CreateOrderDto) {
    return await this.prismaService.order.create({
      data: {
        userId: createOrderDto.userId,
        guestToken: createOrderDto.guestToken,
        status: createOrderDto.status,
        shippingFee: createOrderDto.shippingFee,
        subTotal: createOrderDto.subTotal,
        discountAmount: createOrderDto.discount,
        totalAmount: createOrderDto.totalAmount,
        addressId: createOrderDto.addressId,
        paymentStatus: createOrderDto.paymentStatus,
        orderItems: {
          create: createOrderDto.orderItems.map((item) => ({
            product: {
              connect: { id: item.productId },
            },
            productVariant: {
              connect: { id: item.productVariantId }
            },
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

  }

  async getOrderSummary(userId: number) {
    const existUser = await this.prismaService.user.findUnique({ where: { id: Number(userId) } })

    if (!existUser) throw new BadRequestException(MESSAGES.USER.ERROR.NOT_FOUND)

    return await this.prismaService.$transaction([
      this.prismaService.order.count({ where: { userId: Number(userId) } }),
      this.prismaService.order.count({ where: { userId: Number(userId), status: "PENDING_PAYMENT" } }),
      this.prismaService.order.count({ where: { userId: Number(userId), status: "DELIVERY" } }),
      this.prismaService.order.count({ where: { userId: Number(userId), status: "COMPLETED" } }),
      this.prismaService.order.count({ where: { userId: Number(userId), status: "CANCEL" } })
    ])
  }

  findAll() {
    return `This action returns all order`;
  }

  async findOne(id: number) {
    return await this.prismaService.order.findUnique({
      where: {id},
      include: {
        orderItems: {
          include:{
            product: true,
            productVariant: true
          }
        }
      }
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async updateOrderStatus(id: number, status: string) {
    const existOrder = await this.prismaService.order.findUnique({where: {id}})

    if (!existOrder) throw new BadRequestException("Đơn hàng không tồn tại")

    return await this.prismaService.order.update({where: {id}, data: {status}})
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
