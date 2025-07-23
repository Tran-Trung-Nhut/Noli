import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductPagingDto } from './dto/get-product-paging.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { APP_CONSTANTS, JSON_RESPONSE, MESSAGES } from 'src/constantsAndMessage';
import { LowAvailibleProduct } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async create(createProduct: CreateProductDto) {
    try{
      const existingProduct = await this.prismaService.product.findUnique({
        where: { name: createProduct.name }
      });
      if (existingProduct) {
        return JSON_RESPONSE(HttpStatus.BAD_REQUEST, MESSAGES.PRODUCT.ERROR.EXISTED, null);
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

      return JSON_RESPONSE(HttpStatus.CREATED, MESSAGES.PRODUCT.SUCCESS.CREATE, null)
    }catch (error) {
      return JSON_RESPONSE(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.PRODUCT.ERROR.CREATE_FAILED, error.message);
    }
  }

  findAll() {
    return this.prismaService.product.findMany();
  }

  async findPaging(params: GetProductPagingDto) {
    try{
      const orderBy = { [params.sortBy]: params.sortOrder };

      const products = await this.prismaService.product.findMany({
            skip: Number((params.page - 1) * params.limit),
            take: Number(params.limit),
            orderBy,
            where: {name: {contains: params.search}}})
      

      return JSON_RESPONSE(HttpStatus.OK, MESSAGES.PRODUCT.SUCCESS.FETCH_ALL, products);
            
    }catch (error) {
      return JSON_RESPONSE(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.PRODUCT.ERROR.NOT_FOUND, error.message);
    } 
  }

  async findLowAvailiblePaging(params: GetProductPagingDto) {
    try {
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

      // Lọc các sản phẩm chỉ thuộc 3 trạng thái yêu cầu
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
      const paginated = filteredProducts.slice(skip, skip + params.limit);

      return JSON_RESPONSE(HttpStatus.OK, MESSAGES.PRODUCT.SUCCESS.FETCH_ALL, paginated);
    } catch (error) {
      return JSON_RESPONSE(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MESSAGES.PRODUCT.ERROR.NOT_FOUND,
        error.message,
      );
    }
  }



  findNewProducts() {
    return this.prismaService.product.findMany({
      orderBy: {createdAt: 'desc'},
      take: APP_CONSTANTS.FEATURE_PRODUCTS_LIMIT,
    });
  }

  findOne(id: number) {
    return this.prismaService.product.findUnique({where: { id },});
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try{
      const existingProduct = await this.prismaService.product.findUnique({
        where: { id: id }
      });
      if (!existingProduct) {
        return JSON_RESPONSE(HttpStatus.BAD_REQUEST, MESSAGES.PRODUCT.ERROR.NOT_FOUND, null);
      }
      
      const data = await this.prismaService.product.update({
        where: { id: id },
        data: updateProductDto
      })

      return JSON_RESPONSE(HttpStatus.OK, MESSAGES.PRODUCT.SUCCESS.UPDATE, data)
    }catch (error) {
      return JSON_RESPONSE(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.PRODUCT.ERROR.UPDATE_FAILED, error.message);
    }
  }

  async remove(id: number) {
    try{
      const existingProduct = await this.prismaService.product.findUnique({
        where: { id: id }
      });
      if (!existingProduct) {
        return JSON_RESPONSE(HttpStatus.BAD_REQUEST, MESSAGES.PRODUCT.ERROR.NOT_FOUND, null);
      }
      
      const data = await this.prismaService.product.delete({where: { id: id },})

      return JSON_RESPONSE(HttpStatus.OK, MESSAGES.PRODUCT.SUCCESS.DELETE, data)
    }catch (error) {
      return JSON_RESPONSE(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.PRODUCT.ERROR.DELETE_FAILED, error.message);
    }
  }
}
