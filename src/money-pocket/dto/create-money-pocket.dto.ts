import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateMoneyPocketDto {
  @IsInt()
  @IsNotEmpty()
  readonly startBalance: number;

  @IsString()
  @IsNotEmpty()
  readonly currency: string;

  @IsString()
  // @IsEnum(PocketType, { message: 'Invalid pocket type' })
  readonly pocketName: string;

  @IsString()
  @IsNotEmpty()
  readonly pocketType: string;

  @IsString()
  readonly iconUrl: string;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}
