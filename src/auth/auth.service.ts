import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/typeorm-entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';

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
      throw new UnauthorizedException('User not found');
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

  login(props: LoginProps, res: Response) {
    const jwtAccessSecret = process.env.ACCESS_JWT_SECRET;
    const jwtRefreshSecret = process.env.REFRESH_JWT_SECRET;
    const accessTokenExpiresIn = process.env.ACCESS_EXPIRES_IN;
    const refreshTokenExpiresIn = process.env.REFRESH_EXPIRES_IN;

    if (
      !jwtAccessSecret ||
      !jwtRefreshSecret ||
      !accessTokenExpiresIn ||
      !refreshTokenExpiresIn
    ) {
      throw new InternalServerErrorException(
        'Envrionment variables are not set (ACCESS_JWT_SECRET,REFRESH_JWT_SECRET,ACCESS_EXPIRES_IN,REFRESH_EXPIRES_IN)',
      );
    }

    const payload = { email: props.email, sub: props.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtAccessSecret,
      expiresIn: accessTokenExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtRefreshSecret,
      expiresIn: refreshTokenExpiresIn,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: 'auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      accessToken,
      userId: props.id,
    };
  }

  async refreshTokens(refreshToken: string) {
    const jwtAccessSecret = process.env.ACCESS_JWT_SECRET;
    const jwtRefreshSecret = process.env.REFRESH_JWT_SECRET;
    const accessTokenExpiresIn = process.env.ACCESS_EXPIRES_IN;
    const refreshTokenExpiresIn = process.env.REFRESH_EXPIRES_IN;

    if (
      !jwtAccessSecret ||
      !jwtRefreshSecret ||
      !accessTokenExpiresIn ||
      !refreshTokenExpiresIn
    ) {
      throw new InternalServerErrorException(
        'Envrionment variables are not set (ACCESS_JWT_SECRET,REFRESH_JWT_SECRET,ACCESS_EXPIRES_IN,REFRESH_EXPIRES_IN)',
      );
    }

    try {
      const payload: { email: string; sub: string } =
        await this.jwtService.verifyAsync(refreshToken, {
          secret: jwtRefreshSecret,
        });

      const user = await this.userService.findUserByEmail(payload.email);
      if (!user) throw new UnauthorizedException();

      const newAccessToken = this.jwtService.sign(
        { sub: user.id, email: user.email },
        {
          secret: jwtAccessSecret,
          expiresIn: accessTokenExpiresIn,
        },
      );

      return { accessToken: newAccessToken, userId: user.id };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  logout(res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
    });
  }
}
