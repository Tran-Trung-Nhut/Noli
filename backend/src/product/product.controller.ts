import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductPagingDto } from './dto/get-product-paging.dto';
import { MESSAGES } from 'src/constantsAndMessage';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Get('/paging')
  async findPaging(@Query() params: GetProductPagingDto) {
    return await this.productService.findPaging(params)
  }

  @Get('/low-availible-paging')
  async findLowAvailiblePaging(@Query() params: GetProductPagingDto, @Res() res) {
    return { data: this.productService.findLowAvailiblePaging(params) }
  }


  @Get('new')
  findNewProducts() {
    return "";
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return {
      message: MESSAGES.PRODUCT.SUCCESS.FETCH_ONE, data: await this.productService.findOne(+id)
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Res() res) {
    await this.productService.update(+id, updateProductDto);
    return { message: MESSAGES.PRODUCT.SUCCESS.UPDATE }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productService.remove(+id);
    return { message: MESSAGES.PRODUCT.SUCCESS.DELETE}
  }
}
