import { IsEmail, IsInt, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsInt()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  description: string;

  @IsEmail()
  customerEmail: string;
}
