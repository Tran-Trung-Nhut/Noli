import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MESSAGES } from 'src/constantsAndMessage';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { OrderStatusService } from 'src/order-status/order-status.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly orderStatusService: OrderStatusService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async create(createOrderDto: CreateOrderDto, fromCart: boolean) {
    if (fromCart) {
      return await this.prismaService.$transaction(async (prisma) => {
        let listCardId: number[] = []
        if (createOrderDto.userId) {
          listCardId = (await prisma.cart.findMany({ where: { userId: createOrderDto.userId } })).flatMap(c => c.id)
        } else {
          const cartId = (await prisma.cart.findUnique({ where: { guestToken: createOrderDto.guestToken } }))?.id
          if (cartId) listCardId.push(cartId)
        }

        if (listCardId.length === 0) throw new BadRequestException("Không tìm thấy giỏ hàng của bạn")

        const order = await prisma.order.create({
          data: {
            userId: createOrderDto.userId ?? null,
            guestToken: createOrderDto.guestToken ?? null,
            shippingFee: createOrderDto.shippingFee,
            subTotal: createOrderDto.subTotal,
            discountAmount: createOrderDto.discount,
            totalAmount: createOrderDto.totalAmount,
            addressId: createOrderDto.addressId,
            paymentStatus: createOrderDto.paymentStatus,
            note: createOrderDto.note,
            orderItems: {
              create: createOrderDto.orderItems.map((item) => ({
                product: { connect: { id: item.productId } },
                productVariant: { connect: { id: item.productVariantId } },
                quantity: item.quantity,
                price: item.price,
              })),
            },
            orderStatuses: {
              create: { status: "DRAFT" }
            }
          },
          include: { orderItems: true },
        });

        for (const id of listCardId) {
          for (const orderItem of createOrderDto.orderItems) {
            await prisma.cartItem.deleteMany({
              where: {
                cartId: id,
                productId: orderItem.productId,
                productVariantId: orderItem.productVariantId
              }
            })
          }
        }

        const carts = await prisma.cart.findMany({
          where: { userId: createOrderDto.userId },
          include: {
            cartItems: true,
          },
        });

        for (const cart of carts) {
          const totalAmount = cart.cartItems.reduce(
            (sum, item) => sum + item.quantity * item.priceAtAdding,
            0,
          );

          const numberOfItems = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0)

          await prisma.cart.update({ where: { id: cart.id }, data: { totalAmount, numberOfItems } })

        }

        await this.cacheManager.clear()

        return order
      });

    } else {
      return await this.prismaService.order.create({
        data: {
          userId: createOrderDto.userId,
          guestToken: createOrderDto.guestToken,
          shippingFee: createOrderDto.shippingFee,
          subTotal: createOrderDto.subTotal,
          discountAmount: createOrderDto.discount,
          totalAmount: createOrderDto.totalAmount,
          addressId: createOrderDto.addressId,
          paymentStatus: createOrderDto.paymentStatus,
          note: createOrderDto.note,
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
          orderStatuses: {
            create: { status: "DRAFT" }
          }
        },
      });
    }

  }

  async getOrderSummary(userId: number) {
    const existUser = await this.prismaService.user.findUnique({ where: { id: Number(userId) } })

    if (!existUser) throw new BadRequestException(MESSAGES.USER.ERROR.NOT_FOUND)

    return await this.prismaService.$transaction([
      this.prismaService.order.count({ where: { userId: Number(userId) } }),
      this.prismaService.order.count({
        where: {
          userId: Number(userId),
          orderStatuses: {
            some: {
              isCurrentStatus: true,
              status: "PENDING_PAYMENT"
            }
          }
        }
      }),
      this.prismaService.order.count({
        where: {
          userId: Number(userId),
          orderStatuses: {
            some: {
              isCurrentStatus: true,
              status: "DELIVERY"
            }
          }
        }
      }),
      this.prismaService.order.count({
        where: {
          userId: Number(userId),
          orderStatuses: {
            some: {
              isCurrentStatus: true,
              status: "COMPLETED"
            }
          }
        }
      }),
      this.prismaService.order.count({
        where: {
          userId: Number(userId),
          orderStatuses: {
            some: {
              isCurrentStatus: true,
              status: "CANCEL"
            }
          }
        }
      }),
    ])
  }

  findAll() {
    return `This action returns all order`;
  }

  async findAllByUserIdAndStatus(userId: number, status: string) {
    const existUser = await this.prismaService.user.findUnique({ where: { id: Number(userId) } })

    if (!existUser) throw new BadRequestException(MESSAGES.USER.ERROR.NOT_FOUND)

    const result = await this.prismaService.order.findMany({
      where: {
        userId: Number(userId),
        ...(status !== 'ALL' ? {
          orderStatuses: {
            some: {
              isCurrentStatus: true,
              status
            }
          }
        } : {})
      },
      include: {
        address: true,
        orderItems: {
          select: {
            quantity: true
          }
        },
        orderStatuses: true
      }
    })


    return result.map(o => ({
      ...o,
      totalQuantity: o.orderItems.reduce((sum, item) => sum + item.quantity, 0),
    }));
  }

  async findOne(id: number) {
    return await this.prismaService.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
            productVariant: true
          }
        },
        address: true,
        orderStatuses: true
      }
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async updateOrderStatus(id: number, status: string) {
    const existOrder = await this.prismaService.order.findUnique({ where: { id } })

    if (!existOrder) throw new BadRequestException("Đơn hàng không tồn tại")

    return await this.orderStatusService.create({ orderId: id, status })
  }

  async remove(id: number) {
    return await this.prismaService.order.delete({where: {id}})
  }

  async mergeOrder(userId: number){
    const existingUser = await this.prismaService.user.findUnique({where: {id: userId}})

    if (!existingUser) throw new BadRequestException(MESSAGES.USER.ERROR.NOT_FOUND)

    const carts = await this.prismaService.cart.findMany({where: {userId}})

    if (carts.length === 0) return

    const guestTokens = carts.flatMap(cart => cart.guestToken)

    await this.prismaService.order.updateMany({where: {guestToken: {in: guestTokens}}, data: {userId}})
  }
}
