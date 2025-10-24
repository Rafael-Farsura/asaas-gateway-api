import {
  Body,
  Controller,
  Post,
  Req,
  Headers,
  RawBodyRequest,
  BadRequestException,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Request } from 'express';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout')
  async createCheckout(@Body() dto: CreatePaymentDto) {
    return this.stripeService.createPaymentSession(dto);
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature)
      throw new BadRequestException('Missing stripe-signature header');

    if (!req.rawBody) throw new BadRequestException('Missing raw body');

    return await this.stripeService.handleWebhookEvent(signature, req.rawBody);
  }
}
