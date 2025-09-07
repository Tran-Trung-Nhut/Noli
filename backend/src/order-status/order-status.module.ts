import { Module } from '@nestjs/common';
import { OrderStatusService } from './order-status.service';
import { OrderStatusController } from './order-status.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrderStatusController],
  providers: [OrderStatusService],
  exports: [OrderStatusService]
})
export class OrderStatusModule {}
