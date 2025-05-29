import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from 'src/typeorm-entities/user.entity';

type LoginRequestType = {
  email: string;
  userId: string;
};

type LogoutRequestType = {
  logout: () => void;
};

type GetProfileRequestType = {
  user: Partial<User>;
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: LoginRequestType) {
    return this.authService.login({ email: req.email, id: req.userId });
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  logout(@Request() req: LogoutRequestType) {
    return req.logout();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: GetProfileRequestType) {
    return req.user;
  }
}
