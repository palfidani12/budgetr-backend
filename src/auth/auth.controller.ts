import {
  Controller,
  Post,
  UseGuards,
  Request,
  Res,
  Req,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { User } from 'src/typeorm-entities/user.entity';
import { Response, Request as RequestType } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

type LoginRequestType = {
  user: Partial<User>;
};

type GetProfileRequestType = {
  user: Partial<User>;
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login') // props: {email: '', password: ''} but because the localAuthGuard we get user only
  login(
    @Request() req: LoginRequestType,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(
      { email: req.user.email!, id: req.user.id! },
      res,
    );
  }

  @Post('refresh')
  async refresh(@Req() req: RequestType) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refreshToken: string = req.cookies['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException();

    return this.authService.refreshTokens(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.logout(res);
    return { message: 'Logged out' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('loggedInUser')
  getLoggedInUser(@Request() req: GetProfileRequestType) {
    return req.user;
  }
}
