import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { ProductVariantModule } from './product-variant/product-variant.module';
import { CartModule } from './cart/cart.module';
import { CartItemModule } from './cart-item/cart-item.module';
import { AuthModule } from './auth/auth.module';
import { PaymentsController } from './payment/payment.controller';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
@Module({
  imports: [PrismaModule, ProductModule, ProductVariantModule, CartModule, CartItemModule, AuthModule, UserModule, AddressModule],
  controllers: [PaymentsController  ],
  providers: [],
})
export class AppModule {}
