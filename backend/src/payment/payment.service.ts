import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly orderService: OrderService
  ) { }


  async createMomoPayment(amount: number, orderId: string) {
    const endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const redirectUrl = `${process.env.FRONTEND_DOMAIN_1}/payment-result`;
    const ipnUrl = `${process.env.BACKEND_DOMAIN}/payment/momo/callback`;
    const requestId = orderId + new Date().getTime();
    const orderInfo = "Thanh toán qua MoMo";

    if (secretKey === undefined || accessKey === undefined || partnerCode === undefined) throw new InternalServerErrorException("Momo configuration is missing");
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const payload = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData: "",
      requestType: "captureWallet",
      signature,
      lang: "vi",
    };
    try {
      const result = (await axios.post(endpoint, payload))

      if (result.data.resultCode !== 0) {
        throw new InternalServerErrorException("Thanh toán thất bại, vui lòng thử lại");
      }

      const numberPart = orderId.replace("MOMOPAYMENT", "")

      await this.prismaService.$transaction(async () => {
        await this.prismaService.order.update({ where: { id: Number(numberPart) }, data: { paymentMethod: 'MOMO' } })

        return await this.orderService.updateOrderStatus(Number(numberPart), "PENDING_PAYMENT")
      })

      return result.data;
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async codPayment(orderId: number, orderStatus: string) {
    try {
      return await this.prismaService.$transaction(async () => {
        await this.prismaService.order.update({ where: { id: Number(orderId) }, data: { paymentMethod: 'COD' } })


        return await this.orderService.updateOrderStatus(Number(orderId), orderStatus)
      })

    } catch (error) {
      throw error
    }
  }

}
