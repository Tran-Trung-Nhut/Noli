import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MESSAGES } from 'src/constantsAndMessage';

@Injectable()
export class ProductVariantService {
  constructor(private prismaService: PrismaService) { }
  async create(createProductVariantDto: CreateProductVariantDto, productId: number) {
    try {
      return this.prismaService.productVariant.create({
        data: {
          ...createProductVariantDto,
          productId: productId,
        }
      });
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }

  async isOutOfStock(productId: number) {
    try {
      const product = await this.prismaService.product.findUnique({ where: { id: productId } })
      if (!product) throw new BadRequestException(MESSAGES.PRODUCT.ERROR.NOT_FOUND)

      const result = await this.prismaService.productVariant.aggregate({
        where: { productId },
        _sum: { stock: true }
      })

      if (result._sum.stock !== 0) return false

      return true
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }

  async findAllByProductId(productId: number) {
    return await this.prismaService.productVariant.findMany({ where: { productId } })
  }

  findOne(id: number) {
    return `This action returns a #${id} productVariant`;
  }

  async update(id: number, updateProductVariantDto: UpdateProductVariantDto) {
    try {
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
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }

  async remove(id: number) {
    try {
      const existingProductVariant = await this.prismaService.productVariant.findUnique({
        where: { id: id }
      });
      if (!existingProductVariant) {
        throw new BadRequestException(MESSAGES.PRODUCT_VARIANT.ERROR.NOT_FOUND);
      }

      return await this.prismaService.productVariant.delete({ where: { id: id }, })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }

  async increaseStock(productVariantId: number, quantity: number) {
    try {
      return await this.prismaService.productVariant.update({
        where: {
          id: Number(productVariantId)
        },
        data: {
          stock: {
            increment: quantity
          }
        }
      })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }

  async descreaseStock(productVariantId: number, quantity: number) {
    try {
      return await this.prismaService.productVariant.update({
        where: {
          id: Number(productVariantId)
        },
        data: {
          stock: {
            decrement: quantity
          }
        }
      })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }
}
