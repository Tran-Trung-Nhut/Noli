import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

@Controller('payment')
export class PaymentsController {
    @Post('momo')
    async createPayment(@Body() body, @Res() res) {
        const { amount, orderId } = body;

        const endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        const partnerCode = process.env.MOMO_PARTNER_CODE;
        const accessKey = process.env.MOMO_ACCESS_KEY;
        const secretKey = process.env.MOMO_SECRET_KEY;
        const redirectUrl = `${process.env.FRONTEND_DOMAIN_1}/payment-result`;
        const ipnUrl = "/payment/momo/callback";
        const requestId = orderId + new Date().getTime();
        const orderInfo = "Thanh toán qua MoMo";

        if (secretKey === undefined || accessKey === undefined || partnerCode === undefined) {
            return res.status(500).json({ message: "MoMo configuration is missing" });
        }

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

        return res.json((await axios.post(endpoint, payload)).data); 
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
} 