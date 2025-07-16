/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from '../typeorm-entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { Transaction } from 'src/typeorm-entities/transaction.entity';

describe('UserService', () => {
  let userService: UserService;
  let repository: Repository<User>;
  let module: TestingModule;

  const createUserDto: CreateUserDto = {
    firstName: 'testuser',
    lastName: 'test',
    nickName: 'asdd',
    country: 'asdsad',
    email: 'test@example.com',
    password: 'password123',
  };

  const mockUserRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
    softRemove: jest.fn(),
  };

  const mockTransactionRepository = {};

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();
  });

  beforeEach(() => {
    process.env.PASSWORD_HASHING_SECRET = 'mockSecret';

    userService = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    jest.spyOn(argon2, 'hash').mockClear();
    mockUserRepository.find.mockClear();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should throw error if environment property is not set', async () => {
      delete process.env.PASSWORD_HASHING_SECRET;
      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw error if password hashing fails', async () => {
      jest.spyOn(argon2, 'hash').mockRejectedValue(new Error());
      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw error if user creation fails', async () => {
      mockUserRepository.create.mockRejectedValue(new Error());
      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw error if user save fails', async () => {
      mockUserRepository.save.mockRejectedValue(new Error());
      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should create a user successfully', async () => {
      jest.spyOn(argon2, 'hash').mockResolvedValue('hashedPassword');
      mockUserRepository.create.mockImplementation((user) => user);
      mockUserRepository.save.mockImplementation((user) => ({
        ...user,
        id: 'savedUserId',
      }));
      const userDtoWithoutPassword = {
        firstName: 'testuser',
        lastName: 'test',
        nickName: 'asdd',
        country: 'asdsad',
        email: 'test@example.com',
      };

      expect(await userService.createUser(createUserDto)).toEqual({
        id: 'savedUserId',
        ...userDtoWithoutPassword,
      });

      expect(repository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
      });
    });
  });

  describe('findAllUsers', () => {
    it('should throw error if find function throws error', async () => {
      mockUserRepository.find.mockRejectedValue(new Error());

      await expect(userService.findAllUsers()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return all users successfully', async () => {
      const mockUsers = [
        {
          id: 'user1',
          nickName: 'sandor',
        },
        {
          id: 'user2',
          nickName: 'Janos',
        },
      ];
      mockUserRepository.find.mockResolvedValue(mockUsers);

      expect(await userService.findAllUsers()).toEqual(mockUsers);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findUser', () => {
    it('should throw error if user retrieval throws error', async () => {
      mockUserRepository.findOne.mockRejectedValue(new Error());

      await expect(userService.findUser('user1')).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'user1' },
        relations: ['moneyPockets'],
      });
    });

    it('should return the result of queryfn', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        id: 'user1',
        nickName: 'sandor',
      });

      expect(await userService.findUser('user1')).toEqual({
        id: 'user1',
        nickName: 'sandor',
      });

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user1' },
        relations: ['moneyPockets'],
      });
    });

    it('should return the result of queryfn (byEmail)', async () => {
      mockUserRepository.findOneBy.mockResolvedValue({
        email: 'sandor@asd.com',
        nickName: 'sandor',
      });

      expect(await userService.findUserByEmail('sandor@asd.com')).toEqual({
        email: 'sandor@asd.com',
        nickName: 'sandor',
      });

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: 'sandor@asd.com',
      });
    });
  });

  describe('updateUser', () => {
    it('should throw error if update is unsuccessful', async () => {
      mockUserRepository.update.mockRejectedValue(new Error());

      await expect(
        userService.updateUser('user1', {
          lastName: 'Janos',
        }),
      ).rejects.toThrow(InternalServerErrorException);

      expect(repository.update).toHaveBeenCalledWith(
        { id: 'user1' },
        { lastName: 'Janos' },
      );
    });

    it('should return update result if update is successful', async () => {
      mockUserRepository.update.mockResolvedValue({
        raw: 'SQL Result',
      });

      const result = await userService.updateUser('user1', {
        lastName: 'Janos',
      });

      expect(result).toEqual({
        raw: 'SQL Result',
      });

      expect(repository.update).toHaveBeenCalledWith(
        { id: 'user1' },
        { lastName: 'Janos' },
      );
    });
  });

  describe('removeUser', () => {
    it('should throw error if there is an error during the queryfn', async () => {
      mockUserRepository.findOneBy.mockRejectedValue(new Error());

      await expect(userService.removeUser('user1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw not found error if user is not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(userService.removeUser('user1')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        id: 'user1',
      });

      expect(mockUserRepository.softRemove).not.toHaveBeenCalled();
    });

    it('should throw error if there is an error during the deletion', async () => {
      mockUserRepository.findOneBy.mockResolvedValue({
        id: 'user1',
        firstName: 'Jani',
      });

      mockUserRepository.softRemove.mockRejectedValue(new Error());

      await expect(userService.removeUser('user1')).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        id: 'user1',
      });
      expect(mockUserRepository.softRemove).toHaveBeenCalledWith({
        id: 'user1',
        firstName: 'Jani',
      });
    });

    it('should return user object when a deletion is successful', async () => {
      mockUserRepository.softRemove.mockResolvedValue({
        id: 'user1',
        firstName: 'Jani',
        deletedAt: 'today',
      });

      await expect(userService.removeUser('user1')).resolves.toEqual({
        id: 'user1',
        firstName: 'Jani',
        deletedAt: 'today',
      });

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        id: 'user1',
      });

      expect(mockUserRepository.softRemove).toHaveBeenCalledWith({
        id: 'user1',
        firstName: 'Jani',
      });
    });
  });
});
