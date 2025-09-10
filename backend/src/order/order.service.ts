import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MESSAGES } from 'src/constantsAndMessage';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { OrderStatusService } from 'src/order-status/order-status.service';
import { ProductVariantService } from 'src/product-variant/product-variant.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly orderStatusService: OrderStatusService,
    private readonly productVariantService: ProductVariantService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async create(createOrderDto: CreateOrderDto, fromCart: boolean) {
    try {
      await Promise.all(createOrderDto.orderItems.map(async (orderItem) => {
        const result = await this.prismaService.productVariant.findUnique({ select: { stock: true }, where: { id: orderItem.productVariantId } })
        if (!result) throw new BadRequestException(MESSAGES.PRODUCT_VARIANT.ERROR.NOT_FOUND)
        if (result.stock < orderItem.quantity) throw new BadRequestException({
          code: 'outOfStock',
          productVariantId: orderItem.productVariantId,
          stock: result.stock,
          quantity: orderItem.quantity
        })
      }))

      if (fromCart) {
        return await this.prismaService.$transaction(async (prisma) => {
          let listCartId: number[] = []
          if (createOrderDto.userId) {
            listCartId = (await prisma.cart.findMany({ where: { userId: createOrderDto.userId } })).flatMap(c => c.id)
          } else {
            const cartId = (await prisma.cart.findUnique({ where: { guestToken: createOrderDto.guestToken } }))?.id
            if (cartId) listCartId.push(cartId)
          }

          if (listCartId.length === 0) throw new BadRequestException("Không tìm thấy giỏ hàng của bạn")

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

          for (const id of listCartId) {
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
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
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
    try {
      const order = await this.prismaService.order.findUnique({
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

      if(!order) throw new NotFoundException()

      return order
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async updateOrderStatus(id: number, status: string) {
    try {
      const existOrder = await this.prismaService.order.findUnique({
        where: {
          id
        },
        include: {
          orderItems: {
            include: {
              productVariant: true
            }
          }
        }
      })

      if (!existOrder) throw new BadRequestException("Đơn hàng không tồn tại")

      if ((await this.prismaService.orderStatus.findFirst({
        where: {
          orderId: existOrder.id,
          isCurrentStatus: true
        }
      }))?.status === 'DRAFT') {
        for (const orderItem of existOrder.orderItems) {
          if (orderItem.quantity > orderItem.productVariant.stock) {
            await this.orderStatusService.create({ orderId: id, status: 'CANCEL' })
            throw new BadRequestException({
              code: 'outOfStock',
              productVariantId: orderItem.productVariantId,
              stock: orderItem.productVariant.stock,
              quantity: orderItem.quantity
            })
          }
        }
      }

      return this.prismaService.$transaction(async (prisma) => {
        const newOrderStatus = await this.orderStatusService.create({ orderId: id, status })

        const previousOrderStatus = await prisma.orderStatus.findUnique({ where: { id: newOrderStatus.previousStatusId || 0 } })
        if (status === 'CANCEL') {
          if (previousOrderStatus?.status === 'DRAFT') return newOrderStatus;

          await Promise.all(existOrder.orderItems.map(async (orderItem) => await this.productVariantService.increaseStock(+orderItem.productVariantId, +orderItem.quantity)))
        } else {
          if (previousOrderStatus?.status !== 'DRAFT') return newOrderStatus;

          await Promise.all(existOrder.orderItems.map(async (orderItem) => await this.productVariantService.descreaseStock(+orderItem.productVariantId, +orderItem.quantity)))
        }

        return newOrderStatus
      })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.order.delete({ where: { id } })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }

  async mergeOrder(userId: number) {
    try {
      const existingUser = await this.prismaService.user.findUnique({ where: { id: userId } })

      if (!existingUser) throw new BadRequestException(MESSAGES.USER.ERROR.NOT_FOUND)

      const carts = await this.prismaService.cart.findMany({ where: { userId } })

      if (carts.length === 0) return

      const guestTokens = carts.flatMap(cart => cart.guestToken)

      await this.prismaService.order.updateMany({ where: { guestToken: { in: guestTokens } }, data: { userId } })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }
}
