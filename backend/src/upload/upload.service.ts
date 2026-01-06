import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import cloudinary from './cloudinary.provider';
import { UploadApiResponse } from 'cloudinary';
import { PrismaService } from 'src/prisma/prisma.service';
import { extractPublicIdImage } from 'src/utils';
import { MESSAGES } from 'src/constantsAndMessage';

@Injectable()
export class UploadService {
  constructor(private readonly prismaService: PrismaService) { }

  async uploadUserImage(file: Express.Multer.File, userId: number) {
    try {
      const existUser = await this.prismaService.user.findUnique({where: {id: Number(userId)}})

      if(!existUser) throw new BadRequestException(MESSAGES.USER.ERROR.NOT_FOUND)

      const result = await this.uploadImage(file)

      if(existUser.image && existUser.image.includes("https://res.cloudinary.com")) await this.deleteImage(extractPublicIdImage(existUser.image))

      return await this.prismaService.user.update({ where: { id: Number(userId) }, data: { image: result.secure_url } })
    } catch (error) {
      console.error(error)
      
      if (!(error instanceof InternalServerErrorException)) {
        throw error
      }
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
      
      if (!(error instanceof InternalServerErrorException)) {
        throw error
      }
      throw new InternalServerErrorException(error)
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) return reject(error)
          resolve(result)
        })
      })
    } catch (error) {
      console.error(error)
      
      if (!(error instanceof InternalServerErrorException)) {
        throw error
      }
      throw new InternalServerErrorException(error)
    }
  }
}
