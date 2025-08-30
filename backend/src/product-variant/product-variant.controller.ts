import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { MESSAGES } from 'src/constantsAndMessage';

@Controller('product-variant')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) { }

  @Post(':productId')
  async create(@Body() createProductVariantDto: CreateProductVariantDto, @Param('productId') productId: number, @Res() res) {
    try {
      await this.productVariantService.create(createProductVariantDto, Number(productId));
      return res.status(HttpStatus.CREATED).json({ message: MESSAGES.PRODUCT_VARIANT.SUCCESS.CREATE });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @Get(':productId')
  async findAllByProductId(@Param('productId') productId: number, @Res() res) {
    try {
      const variants = await this.productVariantService.findAllByProductId(Number(productId));
      return res.status(HttpStatus.OK).json(variants)
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productVariantService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductVariantDto: UpdateProductVariantDto, @Res() res) {
    try {
      const variant = await this.productVariantService.update(+id, updateProductVariantDto);
      return res.status(HttpStatus.OK).json(variant)
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const variant = await this.productVariantService.remove(+id);
      return res.status(HttpStatus.OK).json({message: MESSAGES.PRODUCT_VARIANT.SUCCESS.DELETE, data: variant})
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message }); 
    }
  }
}
