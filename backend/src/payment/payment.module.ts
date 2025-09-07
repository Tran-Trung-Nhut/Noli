import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrderStatusModule } from 'src/order-status/order-status.module';

@Module({
  imports: [PrismaModule, OrderStatusModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
