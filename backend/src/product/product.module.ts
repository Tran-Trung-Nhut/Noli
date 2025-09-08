import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [PrismaModule, ReviewModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
