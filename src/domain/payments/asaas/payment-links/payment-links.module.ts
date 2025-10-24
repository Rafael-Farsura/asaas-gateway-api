import { Module } from '@nestjs/common';
import { PaymentLinksController } from 'src/domain/payments/asaas/payment-links/payment-link.controller';
import { PaymentLinksService } from 'src/domain/payments/asaas/payment-links/payment-links.service';
import { AsaasModule } from '../asaas/asaas.module';

@Module({
  imports: [AsaasModule],
  providers: [PaymentLinksService],
  controllers: [PaymentLinksController],
})
export class PaymentLinksModule {}
