import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(private readonly config: ConfigService) {
    this.stripe = new Stripe(this.config.get<string>('STRIPE_SECRET_KEY') | '', {
      apiVersion: '2025-04-30',
    });
  }

  async createPaymentSession(dto: CreatePaymentDto) {
    const { amount, currency, description, customerEmail } = dto;

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: description },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: this.config.get<string>('STRIPE_SUCCESS_URL'),
      cancel_url: this.config.get<string>('STRIPE_CANCEL_URL'),
    });

    this.logger.log(`Stripe session criada: ${session.id}`);
    return { id: session.id, url: session.url };
  }

  async handleWebhookEvent(signature: string, payload: Buffer) {
    const secret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');

    const event = this.stripe.webhooks.constructEvent(payload, signature, secret);

    switch (event.type) {
      case 'checkout.session.completed':
        this.logger.log('Pagamento confirmado no Stripe');
        break;
      default:
        this.logger.warn(`Evento não tratado: ${event.type}`);
    }

    return { received: true };
  }
}
