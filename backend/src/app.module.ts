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
@Module({
  imports: [PrismaModule, ProductModule, ProductVariantModule, CartModule, CartItemModule, AuthModule, UserModule, AddressModule, PaymentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
