import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/typeorm-entities/user.entity';
import { UserService } from 'src/user/user.service';

type ValidateUserProps = {
  email: string;
  givenPassword: string;
};

type LoginProps = {
  email: string;
  id: string;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(props: ValidateUserProps) {
    const secret = process.env.PASSWORD_HASHING_SECRET;
    let user: User | null;

    if (!secret) {
      throw new InternalServerErrorException(
        'PASSWORD_HASHING_SECRET environment variable missing',
      );
    }

    try {
      user = await this.userService.findUserByEmail(props.email);
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
        await argon2.verify(user.password, props.givenPassword, {
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

  login(props: LoginProps) {
    const payload = { email: props.email, sub: props.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
