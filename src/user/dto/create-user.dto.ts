import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;

  @IsOptional()
  @IsString()
  readonly nickName: string;

  @IsEmail()
  readonly email: string;

  @MinLength(6)
  readonly password: string;

  @IsNotEmpty()
  readonly country: string;
}
