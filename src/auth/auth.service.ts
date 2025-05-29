import { Injectable } from '@nestjs/common';
import { User } from 'src/typeorm-entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, givenPassword: string) {
    const user: Partial<User> | null =
      await this.userService.findUserByEmail(email);
    // TODO: Handle error handling better here
    try {
      if (
        user?.password &&
        (await argon2.verify(user.password, givenPassword, {
          secret: Buffer.from(process.env.PASSWORD_HASHING_SECRET ?? ''),
        }))
      ) {
        delete user.password;
        return user;
      }
    } catch {
      return null;
    }
    return null;
  }

  login(user: User) {
    // add types
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
