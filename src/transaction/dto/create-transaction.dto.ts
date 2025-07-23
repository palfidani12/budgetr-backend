import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsInt()
  @IsNotEmpty()
  readonly amount: number;

  @IsString()
  @IsNotEmpty()
  readonly transactionName: string;

  @IsString()
  @IsNotEmpty()
  readonly vendorName: string;

  // TODO: validate timestamp here
  readonly transactionTime: string;

  @IsString()
  @IsNotEmpty()
  readonly moneyPocketId: string;

  readonly categoryIds?: string[];
}
