import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { extractPublicIdImage } from 'src/utils';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uploadService: UploadService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async create(files: Express.Multer.File[], createReviewDto: CreateReviewDto) {
    try {
      const uploadedImages = await Promise.all(
        (files ?? []).map((file) => this.uploadService.uploadImage(file))
      );

      const reuslt = await this.prismaService.review.create({
        data: {
          ...createReviewDto,
          images: uploadedImages.map((img) => img.secure_url),
        },
      });

      this.cacheManager.clear()

      return reuslt
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }

  async getAllByProductId(productId: number) {
    try {
      return await this.prismaService.review.findMany({
        where: {
          productId
        },
        include: {
          user: {
            select:{
              firstName: true,
              lastName: true,
              image: true
            }
          }
        }
      })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }


  async getCountAndAverageRatingByProductId(productId: number) {
    try {
      return await this.prismaService.review.aggregate({
        _avg: { rating: true },
        _count: { _all: true },
        where: { productId },
      });
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }

  async remove(id: number) {
    try {
      const result = await this.prismaService.review.delete({ where: { id } })

      if (!result) throw new BadRequestException()

      await Promise.all(result.images.map(async (image) => {
        const publicId = extractPublicIdImage(image)

        await this.uploadService.deleteImage(publicId)
      }))

      this.cacheManager.clear()

      return result
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }
}
