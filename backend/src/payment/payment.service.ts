import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import * as crypto from 'crypto';
import axios from 'axios';
import { error } from 'console';

@Injectable()
export class PaymentService {

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
    const result = (await axios.post(endpoint, payload)).data

    if (result.resultCode !== 0) {
      throw new InternalServerErrorException("Thanh toán thất bại, vui lòng thử lại");
    }

    return result;
  }

  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
