import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/typeorm-entities/user.entity';
import { UserService } from 'src/user/user.service';

describe('AuthController', () => {
  let authController: AuthController;
  const authServiceLoginFnMock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: authServiceLoginFnMock,
          },
        },
        {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('routes', () => {
    it('login route should call the login function of auth service with request.user and return the jwt token', () => {
      const mockUser = { email: 'sandor@gmail.com', id: 'userId-12' } as User;
      const mockLoginReturnValue = { accessToken: 'sdasdagras4wfwewc343243v' };
      authServiceLoginFnMock.mockReturnValueOnce(mockLoginReturnValue);

      const result = authController.login({
        user: {
          email: mockUser.email,
          id: mockUser.id,
        },
      });
      expect(authServiceLoginFnMock).toHaveBeenCalledTimes(1);
      expect(authServiceLoginFnMock).toHaveBeenCalledWith(mockUser);
      expect(result).toBe(mockLoginReturnValue);
    });

    it('logout route should call the logout function of the request and return void', () => {
      const mockRequestBody = { logout: jest.fn() };

      const result = authController.logout(mockRequestBody);
      expect(mockRequestBody.logout).toHaveBeenCalledTimes(1);
      expect(result).toBe(undefined);
    });

    it('get profile route should return the user from the request', () => {
      const mockUser = { email: 'sanfor@gams.com', id: 'id-1' } as User;

      const result = authController.getProfile({ user: mockUser });
      expect(result).toBe(mockUser);
    });
  });
});
