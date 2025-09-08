import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import cloudinary from './cloudinary.provider';
import { UploadApiResponse } from 'cloudinary';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UploadService {
  constructor(private readonly prismaService: PrismaService) { }

  create(createUploadDto: CreateUploadDto) {
    return 'This action adds a new upload';
  }

  findAll() {
    return `This action returns all upload`;
  }

  findOne(id: number) {
    return `This action returns a #${id} upload`;
  }

  update(id: number, updateUploadDto: UpdateUploadDto) {
    return `This action updates a #${id} upload`;
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }

  async uploadUserImage(file: Express.Multer.File, userId: number) {
    try {
      const result = await this.uploadImage(file)

      return await this.prismaService.user.update({ where: { id: Number(userId) }, data: { image: result.secure_url } })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    try {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            if (!result) {
              return reject(new Error('Upload failed: no result returned from Cloudinary'));
            }
            resolve(result);
          },
        ).end(file.buffer);
      });
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }

}
