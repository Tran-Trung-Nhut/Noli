import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrderStatusModule } from 'src/order-status/order-status.module';
import { ProductVariantModule } from 'src/product-variant/product-variant.module';

@Module({
  imports: [PrismaModule, OrderStatusModule, ProductVariantModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
