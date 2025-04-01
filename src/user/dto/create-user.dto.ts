/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;

  readonly nickName: string;

  @IsEmail()
  readonly email: string;

  @MinLength(6)
  readonly password: string;

  @IsNotEmpty()
  readonly country: string;
}
