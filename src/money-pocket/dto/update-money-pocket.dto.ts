import { IsString } from 'class-validator';

export class UpdateMoneyPocketDto {
  @IsString()
  readonly updatedBalance: number;

  @IsString()
  readonly pocketName: string;

  @IsString()
  readonly pocketType: string;

  @IsString()
  readonly iconUrl: string;
}
