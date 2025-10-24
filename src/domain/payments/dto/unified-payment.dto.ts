import { ApiProperty } from '@nestjs/swagger';

export class UnifiedPaymentDto {
  @ApiProperty({ example: 5000, description: 'Valor do pagamento em centavos' })
  amount: number;

  @ApiProperty({ example: 'brl', description: 'Moeda do pagamento' })
  currency: string;

  @ApiProperty({ example: 'Plano Premium', description: 'Descrição do pagamento' })
  description: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  customerEmail?: string;

  @ApiProperty({ example: 'cus_1234567890abcdef', required: false })
  customerId?: string;

  @ApiProperty({ example: '2025-12-01', required: false })
  dueDate?: string;
}
