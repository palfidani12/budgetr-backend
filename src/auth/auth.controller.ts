import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { User } from 'src/typeorm-entities/user.entity';

type LoginRequestType = {
  user: Partial<User>;
};

type LogoutRequestType = {
  logout: () => void;
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login') // props: {email: '', password: ''} but because the localAuthGuard we get user only
  login(@Request() req: LoginRequestType) {
    return this.authService.login({ email: req.user.email!, id: req.user.id! });
  }

  // @UseGuards(LocalAuthGuard)
  @Post('logout')
  logout(@Request() req: LogoutRequestType) {
    return req.logout();
  }
}
