import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/typeorm-entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Request, Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  const authServiceLoginFnMock = jest.fn();
  const authServiceLogoutFnMock = jest.fn();
  const authServiceRefreshTokensFnMock = jest.fn();
  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: authServiceLoginFnMock,
            logout: authServiceLogoutFnMock,
            refreshTokens: authServiceRefreshTokensFnMock,
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
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('routes', () => {
    it('login route should call the login function of auth service with request.user and response and return the jwt token', () => {
      const mockUser = { email: 'sandor@gmail.com', id: 'userId-12' } as User;
      const mockLoginReturnValue = { accessToken: 'sdasdagras4wfwewc343243v' };
      authServiceLoginFnMock.mockReturnValueOnce(mockLoginReturnValue);

      const result = authController.login(
        {
          user: {
            email: mockUser.email,
            id: mockUser.id,
          },
        },
        mockResponse,
      );
      expect(authServiceLoginFnMock).toHaveBeenCalledTimes(1);
      expect(authServiceLoginFnMock).toHaveBeenCalledWith(
        mockUser,
        mockResponse,
      );
      expect(result).toBe(mockLoginReturnValue);
    });

    describe('refresh route', () => {
      const mockRequest = { cookies: {} } as unknown as Request;
      it('should throw an error if the refreshToken cookie is not set', async () => {
        await expect(authController.refresh(mockRequest)).rejects.toThrow(
          UnauthorizedException,
        );
        expect(authServiceRefreshTokensFnMock).not.toHaveBeenCalled();
      });

      it('should return the content returned by the authservice', async () => {
        mockRequest.cookies = { refreshToken: 'suti' };
        authServiceRefreshTokensFnMock.mockResolvedValue({
          accessToken: 'token',
          userId: 'sandor',
        });
        await expect(authController.refresh(mockRequest)).resolves.toEqual({
          accessToken: 'token',
          userId: 'sandor',
        });
        expect(authServiceRefreshTokensFnMock).toHaveBeenCalledTimes(1);
        expect(authServiceRefreshTokensFnMock).toHaveBeenCalledWith('suti');
      });
    });

    it('logout route should call the logout function of the service and return a message', () => {
      const result = authController.logout(mockResponse);

      expect(result).toEqual({ message: 'Logged out' });
      expect(authServiceLogoutFnMock).toHaveBeenCalledTimes(1);
      expect(authServiceLogoutFnMock).toHaveBeenCalledWith(mockResponse);
    });

    it('getLoggedInUser route should return the user added to the request by the guard', () => {
      const result = authController.getLoggedInUser({ user: { id: 'sanya' } });
      expect(result).toEqual({ id: 'sanya' });
    });
  });
});
