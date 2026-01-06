import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MESSAGES } from 'src/constantsAndMessage';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) { }

  async mergeCart(guestToken: string, userId: number) {
    try {
      const cart = await this.prismaService.cart.findUnique({ where: { guestToken } });

      if (!cart) throw new BadRequestException("Giỏ hàng không tồn tại");

      if (cart.userId) return;

      await this.prismaService.cart.update({ where: { guestToken }, data: { userId, status: 'merged' } });
    } catch (error) {
      console.error(error)
      
      if (!(error instanceof InternalServerErrorException)) {
        throw error
      }
      throw new InternalServerErrorException(error)
    }
  }

  async isCartOwnedByUser(guestToken: string, userId: number) {
    try {
      const cart = await this.prismaService.cart.findUnique({ where: { guestToken } });

      if (!cart) throw new BadRequestException();

      if (cart.userId !== userId) return false
      return true;
    } catch (error) {
      return false
    }
  }

  async create(createCartDto: CreateCartDto) {
    try {
      return await this.prismaService.cart.create({ data: createCartDto });
    } catch (error) {
      console.error(error)
      
      if (!(error instanceof InternalServerErrorException)) {
        throw error
      }
      throw new InternalServerErrorException(error)
    }
  }

  findAll() {
    return `This action returns all cart`;
  }

  async findCartByUserId(userId: number) {
    try {
      const result = await this.prismaService.cart.findFirst({ where: { userId: Number(userId) } });

      if (!result) return await this.prismaService.cart.create({ data: { userId } });
      return result;
    } catch (error) {
      console.error(error)
      
      if (!(error instanceof InternalServerErrorException)) {
        throw error
      }
      throw new InternalServerErrorException(error)
    }
  }

  async findCartAndAllItemsByGuestToken(token: string) {
    try {
      return await this.prismaService.cart.findUnique({
        where: {
          guestToken: token
        },
        include: {
          cartItems: {
            include: {
              product: true,
              productVariant: true
            }
          }
        }
      });
    } catch (error) {
      console.error(error)
      
      if (!(error instanceof InternalServerErrorException)) {
        throw error
      }
      throw new InternalServerErrorException(error)
    }
  }

  async findCartAndAllItemsByUserId(userId: number) {
    try {
      const carts = await this.prismaService.cart.findMany({ where: { userId: Number(userId) }, include: { cartItems: { include: { product: true, productVariant: true } } } });

      const totalProducts: number = carts.reduce((sum, cart) => sum + cart.numberOfItems, 0);
      const totalAmount: number = carts.reduce((sum, cart) => sum + cart.totalAmount, 0);

      const cartItems = carts.flatMap(cart => cart.cartItems);
      let activeCart = carts[0];
      activeCart.cartItems = cartItems;
      activeCart.numberOfItems = totalProducts;
      activeCart.totalAmount = totalAmount;

      return activeCart;
    } catch (error) {
      console.error(error)
      
      if (!(error instanceof InternalServerErrorException)) {
        throw error
      }
      throw new InternalServerErrorException(error)
    }
  }



  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
