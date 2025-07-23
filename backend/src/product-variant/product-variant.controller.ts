import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { JSON_RESPONSE, MESSAGES } from 'src/constantsAndMessage';

@Controller('product-variant')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Post(':productId')
  async create(@Body() createProductVariantDto: CreateProductVariantDto, @Param('productId') productId: number, @Res() res) {
    const variant = await this.productVariantService.create(createProductVariantDto, Number(productId));
    return res.status(HttpStatus.CREATED).json(JSON_RESPONSE(HttpStatus.CREATED, MESSAGES.PRODUCT_VARIANT.SUCCESS.CREATE, variant))
  }

  @Get(':productId')
  async findAllByProductId(@Param('productId') productId: number, @Res() res) {
    const variants = await this.productVariantService.findAllByProductId(Number(productId));
    return res.status(HttpStatus.OK).json(variants)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productVariantService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductVariantDto: UpdateProductVariantDto, @Res() res) {
    const variant = await this.productVariantService.update(+id, updateProductVariantDto);
    return res.status(variant.status).json(variant)
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    const variant = await this.productVariantService.remove(+id);
    return res.status(variant.status).json(variant)
  }
}
