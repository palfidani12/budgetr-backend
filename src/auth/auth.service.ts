import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/typeorm-entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, givenPassword: string) {
    const secret = process.env.PASSWORD_HASHING_SECRET;
    let user: User | null;

    if (!secret) {
      /* console.error(
        'Environment variable is not set (PASSWORD_HASHING_SECRET)',
      ); */
      throw new InternalServerErrorException(
        'PASSWORD_HASHING_SECRET environment variable missing',
      );
    }

    try {
      user = await this.userService.findUserByEmail(email);
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error while retrieving user',
      );
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      if (
        await argon2.verify(user.password, givenPassword, {
          secret: Buffer.from(secret),
        })
      ) {
        const clonedUser: Partial<User> = structuredClone(user);
        delete clonedUser.password;
        return clonedUser;
      }
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error while validating user token',
      );
    }
    return null;
  }

  login({ email, id }: { email: string; id: string }) {
    // add types
    const payload = { email, sub: id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
