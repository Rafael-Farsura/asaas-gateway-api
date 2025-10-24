import { Module } from '@nestjs/common';
import { AsaasModule } from 'src/domain/payments/asaas/asaas/asaas.module';
import { CustomersController } from 'src/domain/payments/asaas/customers/customers.controller';
import { CustomersService } from 'src/domain/payments/asaas/customers/customers.service';

@Module({
  imports: [AsaasModule],
  providers: [CustomersService],
  controllers: [CustomersController],
})
export class CustomersModule {}
