import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { Response } from 'express';

describe('AuthService', () => {
  let authService: AuthService;
  const findUserByEmailMock = jest.fn();
  const jwtServiceSignMock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserByEmail: findUserByEmailMock,
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jwtServiceSignMock,
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    process.env.PASSWORD_HASHING_SECRET = 'mockedSecret';
    findUserByEmailMock.mockClear();
    jest.spyOn(argon2, 'verify').mockClear();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    const mockValidateUserProps = {
      email: 'sandor@gmail.com',
      givenPassword: 'sandor',
    };
    it('should throw error if environment variable is undefined', async () => {
      delete process.env.PASSWORD_HASHING_SECRET;
      await expect(
        authService.validateUser(mockValidateUserProps),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw error if there is an error while retrieving the user', async () => {
      findUserByEmailMock.mockRejectedValue(new Error());
      await expect(
        authService.validateUser(mockValidateUserProps),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should call userService with correct email', async () => {
      jest.spyOn(argon2, 'verify').mockResolvedValue(false);
      findUserByEmailMock.mockResolvedValue({ password: 'asdasd' });
      await authService.validateUser(mockValidateUserProps);
      expect(findUserByEmailMock).toHaveBeenCalledTimes(1);
      expect(findUserByEmailMock).toHaveBeenCalledWith(
        mockValidateUserProps.email,
      );
    });

    it('should throw 404 if there are no user matching the email', async () => {
      findUserByEmailMock.mockResolvedValue(null);
      await expect(
        authService.validateUser(mockValidateUserProps),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw 505 if there is an error during the validation of the token', async () => {
      jest.spyOn(argon2, 'verify').mockRejectedValue(Error);
      findUserByEmailMock.mockResolvedValue({ password: 'asdasd' });
      await expect(
        authService.validateUser(mockValidateUserProps),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should return the user without the password hash, if the verification is correct', async () => {
      jest.spyOn(argon2, 'verify').mockResolvedValue(true);
      findUserByEmailMock.mockResolvedValue({
        password: 'asdasd',
        id: 'sandor',
      });

      expect(await authService.validateUser(mockValidateUserProps)).toEqual({
        id: 'sandor',
      });
    });

    it('should return null if the verification is unsuccessful', async () => {
      const verifySpy = jest.spyOn(argon2, 'verify').mockResolvedValue(false);
      findUserByEmailMock.mockResolvedValue({
        password: 'asdasd',
        id: 'sandor',
      });

      expect(await authService.validateUser(mockValidateUserProps)).toEqual(
        null,
      );
      expect(verifySpy).toHaveBeenCalledWith(
        'asdasd',
        mockValidateUserProps.givenPassword,
        {
          secret: Buffer.from('mockedSecret'),
        },
      );
    });
  });

  describe('login', () => {
    const res = { cookie: jest.fn() } as unknown as Response;
    it('should sing token with correct props', () => {
      jwtServiceSignMock.mockReturnValue('token-ade234c2432');
      expect(
        authService.login({ email: 'sandor@gmail.com', id: 'user-2313' }, res),
      ).toEqual({ accessToken: 'token-ade234c2432' });
    });
  });
});
