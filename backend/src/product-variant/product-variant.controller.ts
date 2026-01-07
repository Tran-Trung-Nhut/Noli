import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { MESSAGES } from 'src/constantsAndMessage';

@Controller('product-variant')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) { }

  @Post('product/:productId')
  async create(@Body() createProductVariantDto: CreateProductVariantDto, @Param('productId') productId: number) {
    return await this.productVariantService.create(createProductVariantDto, Number(productId));
  }

  @Get('product/:productId')
  async findAllByProductId(@Param('productId') productId: number) {
    return await this.productVariantService.findAllByProductId(Number(productId))
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductVariantDto: UpdateProductVariantDto) {
    return await this.productVariantService.update(+id, updateProductVariantDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productVariantService.remove(+id)
  }
}
