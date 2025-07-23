import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { ProductVariantModule } from './product-variant/product-variant.module';
@Module({
  imports: [PrismaModule, ProductModule, ProductVariantModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
