import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('momo')
  async createMomoPayment(@Body() body) {
    const { amount, orderId } = body;

    return await this.paymentService.createMomoPayment(amount, orderId)
  }

  @Post('momo/callback')
  async momoCallback(@Body() body) {
    if (body.resultCode === 0) {
      console.log("Payment successful:", body);
    } else {
      console.log("Payment failed:", body)
    }

    return { message: "Callback received" };
  }


  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
