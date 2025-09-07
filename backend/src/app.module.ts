import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { ProductVariantModule } from './product-variant/product-variant.module';
import { CartModule } from './cart/cart.module';
import { CartItemModule } from './cart-item/cart-item.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { redisStore } from 'cache-manager-redis-yet';
import { OrderStatusModule } from './order-status/order-status.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    PrismaModule, 
    ProductModule, 
    ProductVariantModule, 
    CartModule, 
    CartItemModule, 
    AuthModule, 
    UserModule, 
    AddressModule, 
    PaymentModule, 
    OrderModule, 
    OrderItemModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT)
          },
          password: process.env.REDIS_PASSWORD,
          ttl: 60 * 1000
        })
      })
    }),
    OrderStatusModule,
    UploadModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
