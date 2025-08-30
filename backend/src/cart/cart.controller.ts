import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { MESSAGES } from 'src/constantsAndMessage';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post('/merge-cart')
  async mergeCart(@Body() body: { guestToken: string | null; userId: number }, @Res() res) {
    try {
      if (!body.guestToken) return res.status(HttpStatus.OK).json({ message: "Người dùng hiện tại không có giỏ hàng" });
      await this.cartService.mergeCart(body.guestToken, body.userId);
      return res.status(HttpStatus.OK).json({ message: "Đã hợp nhất giỏ hàng" });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @Get('/loged-in/:userId')
  async findCartByUserId(@Param('userId') userId: number, @Res() res) {
    try {
      return res.status(HttpStatus.OK).json({ data: await this.cartService.findCartByUserId(userId) });
    } catch (error) {
      console.log(error)
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @Post('/is-owned-by-user')
  async isCartOwnedByUser(@Body() body: { guestToken: string; userId: number }, @Res() res) {
    try {
      const isOwned = await this.cartService.isCartOwnedByUser(body.guestToken, body.userId);
      return res.status(HttpStatus.OK).json({ data: {isOwned} });
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
      

  @Post()
  async create(@Body() createCartDto: CreateCartDto, @Res() res) {
    try {
      return res.status(HttpStatus.CREATED).json({ message: MESSAGES.CART.SUCCESS.CREATE, data: await this.cartService.create(createCartDto) });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get('guest/:token')
  async findCartAndAllItemsByGuestToken(@Param('token') token: string, @Res() res) {
    try {
      return res.status(HttpStatus.OK).json(await this.cartService.findCartAndAllItemsByGuestToken(token));
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @Get('user/:userId')
  async findCartAndAllItemsByUserId(@Param('userId') userId: number, @Res() res) {
    try {
      return res.status(HttpStatus.OK).json(await this.cartService.findCartAndAllItemsByUserId(userId));
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
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
