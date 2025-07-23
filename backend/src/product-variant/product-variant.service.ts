import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JSON_RESPONSE, MESSAGES } from 'src/constantsAndMessage';

@Injectable()
export class ProductVariantService {
  constructor(private prismaService: PrismaService) {}
  create(createProductVariantDto: CreateProductVariantDto, productId: number) {
    return this.prismaService.productVariant.create({data: {
      ...createProductVariantDto,
      productId: productId,
    }});
  }

  async findAllByProductId(productId: number) {
    try{
      const variants = await this.prismaService.productVariant.findMany({where: {productId}})
      
      return JSON_RESPONSE(HttpStatus.OK, MESSAGES.PRODUCT_VARIANT.SUCCESS.FETCH_ALL, variants);
            
    }catch (error) {
      return JSON_RESPONSE(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.PRODUCT_VARIANT.ERROR.NOT_FOUND, error.message);
    } 
  }

  findOne(id: number) {
    return `This action returns a #${id} productVariant`;
  }

  async update(id: number, updateProductVariantDto: UpdateProductVariantDto) {
    try{
      const existingProductVariant = await this.prismaService.productVariant.findUnique({
        where: { id: id }
      });
      if (!existingProductVariant) {
        return JSON_RESPONSE(HttpStatus.NOT_FOUND, MESSAGES.PRODUCT_VARIANT.ERROR.NOT_FOUND, null);
      }
      
      const data = await this.prismaService.productVariant.update({
        where: {id},
        data: updateProductVariantDto
      })

      return JSON_RESPONSE(HttpStatus.OK, MESSAGES.PRODUCT_VARIANT.SUCCESS.UPDATE, data)
    }catch (error) {
      return JSON_RESPONSE(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.PRODUCT_VARIANT.ERROR.UPDATE_FAILED, error.message);
    }
  }

  async remove(id: number) {
    try{
      const existingProductVariant = await this.prismaService.productVariant.findUnique({
        where: { id: id }
      });
      if (!existingProductVariant) {
        return JSON_RESPONSE(HttpStatus.NOT_FOUND, MESSAGES.PRODUCT_VARIANT.ERROR.NOT_FOUND, null);
      }
      
      const data = await this.prismaService.productVariant.delete({where: { id: id },})

      return JSON_RESPONSE(HttpStatus.OK, MESSAGES.PRODUCT_VARIANT.SUCCESS.DELETE, data)
    }catch (error) {
      return JSON_RESPONSE(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.PRODUCT_VARIANT.ERROR.DELETE_FAILED, error.message);
    }
  }
}
