import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AccessTokensModule } from 'src/domain/payments/asaas/access-tokens/access-tokens.module';
import { AsaasModule } from 'src/domain/payments/asaas/asaas/asaas.module';
import asaasConfig from 'src/domain/payments/asaas/config/asaas.config';
import databaseConfig, {
  getTypeOrmConfig,
} from 'src/domain/payments/asaas/config/database.config';
import { CustomersModule } from 'src/domain/payments/asaas/customers/customers.module';
import { NotificationsModule } from 'src/domain/payments/asaas/notifications/notifications.module';
import { PaymentLinksModule } from 'src/domain/payments/asaas/payment-links/payment-links.module';
import { PaymentsModule } from 'src/domain/payments/asaas/payments/payments.module';
import { StripeModule } from './domain/payments/stripe/stripe.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [asaasConfig, databaseConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => getTypeOrmConfig(),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api'],
    }),
    AsaasModule.registerAsync(),
    AccessTokensModule,
    CustomersModule,
    PaymentsModule,
    PaymentLinksModule,
    NotificationsModule,
    StripeModule,
  ],
})
export class AppModule {}
