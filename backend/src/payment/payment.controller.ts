import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateMomoPaymentDto } from './dto/create-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('momo')
  async createMomoPayment(@Body() body: CreateMomoPaymentDto) {
    const { amount, orderId } = body;

    return await this.paymentService.createMomoPayment(amount, orderId)
  }

  @Post('momo/callback')
  async momoCallback(@Body() body: any) {
    if (body.resultCode === 0) {
      console.log("Payment successful:", body);
    } else {
      console.log("Payment failed:", body)
    }

    return { message: "Callback received" };
  }

  @Post('cod')
  async codPayment(@Body() body: any) {
    const { orderId, orderStatus } = body;

    return await this.paymentService.codPayment(orderId, orderStatus)
  }

}
