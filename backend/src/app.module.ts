import { Module } from '@nestjs/common';
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
@Module({
  imports: [PrismaModule, ProductModule, ProductVariantModule, CartModule, CartItemModule, AuthModule, UserModule, AddressModule, PaymentModule, OrderModule, OrderItemModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
