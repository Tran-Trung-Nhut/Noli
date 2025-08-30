import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { MESSAGES } from 'src/constantsAndMessage';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) { }

  async mergeCart(guestToken: string, userId: number) {
    const cart = await this.prismaService.cart.findUnique({ where: { guestToken } });

    if (!cart) throw new BadRequestException("Giỏ hàng không tồn tại");

    if (cart.userId === userId) return;

    await this.prismaService.cart.update({ where: { guestToken }, data: { userId, status: 'merged' } });
  }


  async create(createCartDto: CreateCartDto) {
    return await this.prismaService.cart.create({ data: createCartDto });

  }

  findAll() {
    return `This action returns all cart`;
  }

  async findCartByUserId(userId: number) {
    const result = await this.prismaService.cart.findFirst({ where: { userId } });

    if (!result) return await this.prismaService.cart.create({ data: { userId } });
    return result;
  }

  async findCartAndAllItemsByGuestToken(token: string) {
    return await this.prismaService.cart.findUnique({ where: { guestToken: token }, include: { cartItems: { include: { product: true, productVariant: true } } } });
  }

  async findCartAndAllItemsByUserId(userId: number) {
    const carts = await this.prismaService.cart.findMany({ where: { userId: Number(userId) }, include: { cartItems: { include: { product: true, productVariant: true } } } });
    
    const cartItems = carts.flatMap(cart => cart.cartItems);
    let activeCart = carts[0];
    activeCart.cartItems = cartItems;

    return activeCart;
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
