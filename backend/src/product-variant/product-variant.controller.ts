import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { MESSAGES } from 'src/constantsAndMessage';

@Controller('product-variant')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) { }

  @Post(':productId')
  async create(@Body() createProductVariantDto: CreateProductVariantDto, @Param('productId') productId: number) {
    await this.productVariantService.create(createProductVariantDto, Number(productId));
    return { message: MESSAGES.PRODUCT_VARIANT.SUCCESS.CREATE }
  }

  @Get(':productId')
  async findAllByProductId(@Param('productId') productId: number, @Res() res) {
    return { data: await this.productVariantService.findAllByProductId(Number(productId)) }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productVariantService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductVariantDto: UpdateProductVariantDto) {
    return { message: await this.productVariantService.update(+id, updateProductVariantDto) }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return { message: MESSAGES.PRODUCT_VARIANT.SUCCESS.DELETE, data: await this.productVariantService.remove(+id) }
  }
}
