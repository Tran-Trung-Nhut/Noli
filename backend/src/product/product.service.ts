import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductPagingDto } from './dto/get-product-paging.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { APP_CONSTANTS, MESSAGES } from 'src/constantsAndMessage';
import { LowAvailibleProduct } from './entities/product.entity';
import { ReviewService } from 'src/review/review.service';
import { ProductVariantService } from 'src/product-variant/product-variant.service';


@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly reviewService: ReviewService,
    private readonly productVariantService: ProductVariantService
  ) { }

  async create(createProduct: CreateProductDto) {
    try {
      const existingProduct = await this.prismaService.product.findUnique({
        where: { name: createProduct.name }
      });
      if (existingProduct) {
        throw new BadRequestException(MESSAGES.PRODUCT.ERROR.EXISTED);
      }

      await this.prismaService.product.create({
        data: {
          name: createProduct.name,
          description: createProduct.description,
          defaultPrice: createProduct.defaultPrice,
          image: createProduct.image,
          category: createProduct.category,
          variants: {
            create: createProduct.productVariants,
          },
        },
      });
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }

  }

  async findAll() {
    return await this.prismaService.product.findMany();
  }

  async findPaging(params: GetProductPagingDto) {
    const orderBy = { [params.sortBy]: params.sortOrder };

    try {
      const products = await this.prismaService.product.findMany({
        skip: Number((params.page - 1) * params.limit),
        take: Number(params.limit),
        orderBy,
        where: {
          name: { contains: params.search },
          defaultPrice: {
            ...(params.minPrice ? { gte: Number(params.minPrice) } : {}),
            ...(params.maxPrice ? { lte: Number(params.maxPrice) } : {}),
          },
          ...(params.category ? { category: { has: params.category } } : {})
        },
      })

      return await Promise.all(products.map(async (product) => {
        const reviews = await this.reviewService.getCountAndAverageRatingByProductId(+product.id)
        const outOfStock = await this.productVariantService.isOutOfStock(product.id)
        const soldQuantity = (await this.totalSold(product.id))._sum.quantity

        return {
          ...product,
          averageRating: reviews._avg.rating,
          countReviews: reviews._count._all,
          outOfStock: outOfStock,
          soldQuantity: soldQuantity
        }
      }))
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }

  async findLowAvailiblePaging(params: GetProductPagingDto) {
    const allProducts = await this.prismaService.product.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        name: {
          contains: params.search,
        },
      },
      include: {
        variants: true,
      },
    });

    const filteredProducts: LowAvailibleProduct[] = [];

    for (const product of allProducts) {
      const totalProduct = product.variants.reduce((acc, variant) => acc + variant.stock, 0);
      const hasZeroStockVariant = product.variants.some(v => v.stock === 0);

      let status = '';
      if (totalProduct === 0) {
        status = 'Hết hàng';
      } else if (hasZeroStockVariant) {
        status = 'Màu sắc hoặc kích thước hết hàng';
      } else if (totalProduct < 10) {
        status = 'Số lượng hàng còn rất ít';
      } else {
        continue; // Skip các sản phẩm còn hàng
      }

      const { defaultPrice, description, image, ...rest } = product;

      filteredProducts.push({
        ...rest,
        totalProduct,
        status,
      });
    }

    // Paging sau khi lọc
    const skip = (params.page - 1) * params.limit;

    return filteredProducts.slice(skip, skip + params.limit);
  }



  findNewProducts() {
    return this.prismaService.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: APP_CONSTANTS.FEATURE_PRODUCTS_LIMIT,
    });
  }

  async findOne(id: number) {
    try {
      const product = await this.prismaService.product.findUnique({ where: { id }, include: { variants: true } });
      if (!product) throw new NotFoundException(MESSAGES.PRODUCT.ERROR.NOT_FOUND)

      const reviews = await this.reviewService.getCountAndAverageRatingByProductId(+product.id)

      const outOfStock = await this.productVariantService.isOutOfStock(product.id)

      const soldQuantity = (await this.totalSold(id))._sum.quantity

      return {
        ...product,
        averageRating: reviews._avg.rating,
        countReviews: reviews._count._all,
        outOfStock: outOfStock,
        soldQuantity: soldQuantity
      }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const existingProduct = await this.prismaService.product.findUnique({
        where: { id: id }
      });
      if (!existingProduct) {
        throw new BadRequestException(MESSAGES.PRODUCT.ERROR.NOT_FOUND);
      }

      return await this.prismaService.product.update({
        where: { id: id },
        data: updateProductDto
      })
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error)
    }
  }

  async remove(id: number) {
    try {
      const existingProduct = await this.prismaService.product.findUnique({
        where: { id: id }
      });
      if (!existingProduct) {
        throw new BadRequestException(MESSAGES.PRODUCT.ERROR.NOT_FOUND);
      }

      return await this.prismaService.product.delete({ where: { id: id }, })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }

  async totalSold(id: number){
    try {
      const orders = await this.prismaService.order.findMany({
        where: {
          orderStatuses: {
            some: {
              status: {
                in: ["PENDING_PAYMENT", "DELIVERY", "COMPLETED"]
              }
            }
          } 
        }
      })

      const orderIds = orders.flatMap(order => order.id)

      return await this.prismaService.orderItem.aggregate({
        where: {
          orderId: {
            in: orderIds
          },
          productId: id
        },
        _sum: {
          quantity: true
        }
      })

    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }
}
