import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MESSAGES } from 'src/constantsAndMessage';

@Injectable()
export class CartItemService {
  constructor(private prismaService: PrismaService) { }

  async create(createCartItem: CreateCartItemDto) {
    const cart = await this.prismaService.cart.findUnique({ where: { guestToken: createCartItem.guestToken } })
    if (!cart) throw new BadRequestException(MESSAGES.CART_ITEM.ERROR.NOT_FOUND);

    const existItem = await this.prismaService.cartItem.findMany({
      where:{
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
