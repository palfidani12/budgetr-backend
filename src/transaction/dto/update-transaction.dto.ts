import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateTransactionDto {
  @IsInt()
  @IsOptional()
  readonly amount?: number;

  @IsString()
  @IsOptional()
  readonly transactionName?: string;

  @IsString()
  @IsOptional()
  readonly vendorName?: string;

  @IsString()
  @IsOptional()
  readonly transactionTime?: string;
}
