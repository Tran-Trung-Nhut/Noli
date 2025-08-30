import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductPagingDto } from './dto/get-product-paging.dto';
import { MESSAGES } from 'src/constantsAndMessage';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Res() res) {
    try {
      await this.productService.create(createProductDto);
      return res.status(HttpStatus.CREATED).json({ message: MESSAGES.PRODUCT.SUCCESS.CREATE });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('/paging')
  async findPaging(@Query() params: GetProductPagingDto, @Res() res) {
    try {
      return res.status(HttpStatus.OK).json({data: await this.productService.findPaging(params)});
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @Get('/low-availible-paging')
  async findLowAvailiblePaging(@Query() params: GetProductPagingDto, @Res() res) {
    try {
      const response = await this.productService.findLowAvailiblePaging(params);
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }


  @Get('new')
  findNewProducts() {
    return "";
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res) {
    try {
      return res.status(HttpStatus.OK).json({ message: MESSAGES.PRODUCT.SUCCESS.FETCH_ONE, data: await this.productService.findOne(+id) });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Res() res) {
    try {
      await this.productService.update(+id, updateProductDto);
      return res.status(HttpStatus.OK).json({ message: MESSAGES.PRODUCT.SUCCESS.UPDATE })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const response = await this.productService.remove(+id);
      return res.status(HttpStatus.OK).json(response)
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
}
