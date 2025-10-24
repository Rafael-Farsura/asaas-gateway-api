import { Injectable, Logger } from '@nestjs/common';
import { StripeService } from './stripe/stripe.service';
import { PaymentsService } from './asaas/payments/payment.service';
import { EnvironmentOptionsType } from 'src/domain/payments/asaas/types/environment.enum';
import { UnifiedPaymentDto } from './dto/unified-payment.dto';

@Injectable()
export class PaymentOrchestratorService {
  private readonly logger = new Logger(PaymentOrchestratorService.name);

  constructor(
    private readonly stripe: StripeService,
    private readonly asaas: PaymentsService,
  ) {}

  async createPayment(
    provider: 'stripe' | 'asaas',
    data: UnifiedPaymentDto,
    token?: string,
    environment: EnvironmentOptionsType = 'PROD',
  ) {
    if (provider === 'stripe') {
      return this.stripe.createPaymentSession({
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        customerEmail: data.customerEmail ?? '',
      });
    }

    if (provider === 'asaas') {
      return this.asaas.create(
        {
          customer: data.customerId ?? '',
          value: data.amount / 100, // Stripe usa centavos, Asaas usa reais
          dueDate: data.dueDate ?? new Date().toISOString().split('T')[0],
          billingType: 'PIX', 
        },
        token!,
        environment,
      );
    }

    throw new Error(`Provedor de pagamento '${provider}' não suportado.`);
  }
}
