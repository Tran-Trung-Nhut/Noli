import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MESSAGES } from 'src/constantsAndMessage';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CartItemService {
  constructor(
    private prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async create(createCartItem: CreateCartItemDto) {
    try {
      const cart = await this.prismaService.cart.findUnique({ where: { guestToken: createCartItem.guestToken } })
      if (!cart) throw new BadRequestException(MESSAGES.CART_ITEM.ERROR.NOT_FOUND);

      const existItem = await this.prismaService.cartItem.findMany({
        where: {
          cartId: cart.id,
          productId: createCartItem.productId,
          productVariantId: createCartItem.productVariantId
        }
      })

      if (existItem.length > 0) throw new BadRequestException("Màu và kích thước này của sản phẩm đã có trong giỏ hàng")

      await this.prismaService.$transaction([
        this.prismaService.cartItem.create({
          data: {
            productId: createCartItem.productId,
            productVariantId: createCartItem.productVariantId,
            quantity: createCartItem.quantity,
            priceAtAdding: createCartItem.priceAtAdding,
            cartId: cart.id
          }
        }),
        this.prismaService.cart.update({
          where: { id: cart.id },
          data: {
            totalAmount: { increment: createCartItem.priceAtAdding * createCartItem.quantity },
            numberOfItems: { increment: createCartItem.quantity },
          }
        })
      ])

      await this.cacheManager.clear()
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async getCountByUserid(userId: number) {
    try {
      const existingUser = await this.prismaService.user.findUnique({ where: { id: Number(userId) } })

      if (!existingUser) throw new BadRequestException(MESSAGES.USER.ERROR.NOT_FOUND)

      return await this.prismaService.cartItem.count({
        where: {
          cart: {
            userId: Number(userId)
          }
        }
      })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }

  async getCountByGuestToken(guestToken: string) {
    try {
      const existingCart = await this.prismaService.cart.findUnique({ where: { guestToken } })

      if (!existingCart) throw new BadRequestException(MESSAGES.CART.ERROR.NOT_FOUND)

      return await this.prismaService.cartItem.count({
        where: {
          cart: {
            guestToken
          }
        }
      })
    } catch (error) {
      console.error(error)
      
      if (!(error instanceof InternalServerErrorException)) {
        throw error
      }
      throw new InternalServerErrorException(error)
    }
  }

  findAll() {
    return `This action returns all cartItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cartItem`;
  }

  update(id: number, updateCartItemDto: UpdateCartItemDto) {
    return `This action updates a #${id} cartItem`;
  }

  async remove(id: number) {
    try {
      const cartItem = await this.prismaService.cartItem.findUnique({ where: { id } });
      if (!cartItem) throw new BadRequestException(MESSAGES.CART_ITEM.ERROR.NOT_FOUND);

      await this.prismaService.$transaction([
        this.prismaService.cartItem.delete({ where: { id } }),
        this.prismaService.cart.update({
          where: { id: cartItem.cartId },
          data: {
            totalAmount: { decrement: cartItem.priceAtAdding * cartItem.quantity },
            numberOfItems: { decrement: cartItem.quantity },
          }
        })
      ])

      await this.cacheManager.clear()
    } catch (error) {
      console.error(error)
      
      if (!(error instanceof InternalServerErrorException)) {
        throw error
      }
      throw new InternalServerErrorException(error)
    }
  }
}
