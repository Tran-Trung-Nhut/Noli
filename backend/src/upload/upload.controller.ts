import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/image/user-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserImage (@Body('userId') userId: string, @UploadedFile() file: Express.Multer.File) {
    
    return await this.uploadService.uploadUserImage(file, +userId)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProductImage (@UploadedFile() file: Express.Multer.File) {
    
    return await this.uploadService.uploadImage(file)
  }

}
