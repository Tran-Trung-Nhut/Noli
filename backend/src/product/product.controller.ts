import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductPagingDto } from './dto/get-product-paging.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Res() res) {
    const response = await this.productService.create(createProductDto);
    return res.status(response.status).json(response);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('/paging')
  async findPaging(@Query() params: GetProductPagingDto, @Res() res) {
    const response = await this.productService.findPaging(params);
    return res.status(response.status).json(response);
  }

    @Get('/low-availible-paging')
  async findLowAvailiblePaging(@Query() params: GetProductPagingDto, @Res() res) {
    const response = await this.productService.findLowAvailiblePaging(params);
    return res.status(response.status).json(response);
  }


  @Get('new')
  findNewProducts() {
    return "";
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Res() res) {
    const result = await this.productService.update(+id, updateProductDto);
    return res.status(result.status).json(result)
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    const result = await this.productService.remove(+id);
    return res.status(result.status).json(result);
  }
}
