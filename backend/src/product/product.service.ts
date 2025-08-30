import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductPagingDto } from './dto/get-product-paging.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { APP_CONSTANTS, MESSAGES } from 'src/constantsAndMessage';
import { LowAvailibleProduct } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) { }

  async create(createProduct: CreateProductDto) {
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

  }

  findAll() {
    return this.prismaService.product.findMany();
  }

  async findPaging(params: GetProductPagingDto) {
    const orderBy = { [params.sortBy]: params.sortOrder };

    return await this.prismaService.product.findMany({
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
      }
    })
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
    return await this.prismaService.product.findUnique({ where: { id }, include: { variants: true } });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const existingProduct = await this.prismaService.product.findUnique({
      where: { id: id }
    });
    if (!existingProduct) {
      throw new BadRequestException(MESSAGES.PRODUCT.ERROR.NOT_FOUND);
    }

    await this.prismaService.product.update({
      where: { id: id },
      data: updateProductDto
    })
  }

  async remove(id: number) {
    const existingProduct = await this.prismaService.product.findUnique({
      where: { id: id }
    });
    if (!existingProduct) {
      throw new BadRequestException(MESSAGES.PRODUCT.ERROR.NOT_FOUND);
    }

    return await this.prismaService.product.delete({ where: { id: id }, })
  }
}
