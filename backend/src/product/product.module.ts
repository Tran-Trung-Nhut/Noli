import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ReviewModule } from 'src/review/review.module';
import { ProductVariantModule } from 'src/product-variant/product-variant.module';

@Module({
  imports: [PrismaModule, ReviewModule, ProductVariantModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
