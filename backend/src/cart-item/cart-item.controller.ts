import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { MESSAGES } from 'src/constantsAndMessage';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) { }

  @Post()
  async create(@Body() createCartItemDto: CreateCartItemDto) {
    return { data: await this.cartItemService.create(createCartItemDto) }
  }

  @Get()
  findAll() {
    return this.cartItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartItemDto: UpdateCartItemDto) {
    return this.cartItemService.update(+id, updateCartItemDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.cartItemService.remove(+id)
    return { message: MESSAGES.CART_ITEM.SUCCESS.DELETE }
  }
}
