import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UploadedFiles, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { UpdateReviewDto } from './dto/update-review.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Body('userId') userId: string,
    @Body('productId') productId: string,
    @Body('text') text: string | null,
    @Body('rating') rating: string,
    @UploadedFiles() files: Express.Multer.File[]) {
    return await this.reviewService.create(files, {
      userId: +userId,
      productId: +productId,
      ...(text ? { text } : {}),
      rating: +rating
    });
  }

  @Get('/productId/:productId')
  async getAllByProductId(@Param('productId') productId: number) {
    return await this.reviewService.getAllByProductId(+productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.reviewService.remove(+id);
  }
}
