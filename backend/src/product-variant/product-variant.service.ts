import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MESSAGES } from 'src/constantsAndMessage';

@Injectable()
export class ProductVariantService {
  constructor(private prismaService: PrismaService) { }
  async create(createProductVariantDto: CreateProductVariantDto, productId: number) {
    return this.prismaService.productVariant.create({
      data: {
        ...createProductVariantDto,
        productId: productId,
      }
    });
  }

  async findAllByProductId(productId: number) {
    return await this.prismaService.productVariant.findMany({ where: { productId } })
  }

  findOne(id: number) {
    return `This action returns a #${id} productVariant`;
  }

  async update(id: number, updateProductVariantDto: UpdateProductVariantDto) {
    const existingProductVariant = await this.prismaService.productVariant.findUnique({
      where: { id: id }
    });
    if (!existingProductVariant) {
      throw new BadRequestException(MESSAGES.PRODUCT_VARIANT.ERROR.NOT_FOUND);
    }

    return await this.prismaService.productVariant.update({
      where: { id },
      data: updateProductVariantDto
    })

  }

  async remove(id: number) {
    const existingProductVariant = await this.prismaService.productVariant.findUnique({
      where: { id: id }
    });
    if (!existingProductVariant) {
      throw new BadRequestException(MESSAGES.PRODUCT_VARIANT.ERROR.NOT_FOUND);
    }

    return await this.prismaService.productVariant.delete({ where: { id: id }, })
  }
}
