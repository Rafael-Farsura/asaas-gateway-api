import { Module } from '@nestjs/common';
import { NotificationsController } from 'src/domain/payments/asaas/notifications/notification.controller';
import { NotificationsService } from 'src/domain/payments/asaas/notifications/notifications.service';
import { AsaasModule } from '../asaas/asaas.module';

@Module({
  imports: [AsaasModule],
  providers: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
