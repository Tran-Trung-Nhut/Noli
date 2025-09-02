import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, BadRequestException, UseInterceptors } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { MESSAGES } from 'src/constantsAndMessage';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post('/merge-cart')
  async mergeCart(@Body() body: { guestToken: string | null; userId: number }) {
    if (!body.guestToken) throw new BadRequestException("Người dùng hiện tại không có giỏ hàng")
    await this.cartService.mergeCart(body.guestToken, body.userId);
    return { message: "Đã hợp nhất giỏ hàng" }
  }

  @Get('/loged-in/:userId')
  async findCartByUserId(@Param('userId') userId: number) {
    return await this.cartService.findCartByUserId(userId)
  }

  @Post('/is-owned-by-user')
  async isCartOwnedByUser(@Body() body: { guestToken: string; userId: number }) {
    return { isOwned: await this.cartService.isCartOwnedByUser(body.guestToken, body.userId) }
  }


  @Post()
  async create(@Body() createCartDto: CreateCartDto) {
    return { message: MESSAGES.CART.SUCCESS.CREATE, data: await this.cartService.create(createCartDto) }
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get('guest/:token')
  async findCartAndAllItemsByGuestToken(@Param('token') token: string) {
    return await this.cartService.findCartAndAllItemsByGuestToken(token)
  }

  @Get('user/:userId')
  async findCartAndAllItemsByUserId(@Param('userId') userId: number) {
    return await this.cartService.findCartAndAllItemsByUserId(userId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
