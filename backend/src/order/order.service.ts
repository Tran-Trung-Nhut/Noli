import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
        orderItems: {
          create: createOrderDto.orderItems.map((item) => ({
            product: {
              connect: { id: item.productId },
            },
            productVariant: {
              connect: { id: item.productVariantId}
            },
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
