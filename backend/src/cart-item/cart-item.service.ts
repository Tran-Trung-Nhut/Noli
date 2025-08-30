import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MESSAGES } from 'src/constantsAndMessage';

@Injectable()
export class CartItemService {
  constructor(private prismaService: PrismaService) { }

  async create(createCartItemDto: CreateCartItemDto) {
    const cart = await this.prismaService.cart.findUnique({ where: { guestToken: createCartItemDto.guestToken } })
    if (!cart) throw new BadRequestException(MESSAGES.CART_ITEM.ERROR.NOT_FOUND);

    await this.prismaService.$transaction([
      this.prismaService.cartItem.create({
        data: {
          productId: createCartItemDto.productId,
          productVariantId: createCartItemDto.productVariantId,
          quantity: createCartItemDto.quantity,
          priceAtAdding: createCartItemDto.priceAtAdding,
          cartId: cart.id
        }
      }),
      this.prismaService.cart.update({
        where: { id: cart.id },
        data: {
          totalAmount: { increment: createCartItemDto.priceAtAdding * createCartItemDto.quantity },
          numberOfItems: { increment: createCartItemDto.quantity },
        }
      })
    ])
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
  }
}
