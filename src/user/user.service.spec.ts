/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from '../typeorm-entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const createUserDto: CreateUserDto = {
    firstName: 'testuser',
    lastName: 'test',
    nickName: 'asdd',
    country: 'asdsad',
    email: 'test@example.com',
    password: 'password123',
  };

  const mockUserRepository = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((user) => Promise.resolve({ id: 'userId', ...user })),
    findOne: jest.fn(),
    findOneBy: jest.fn(({ id }: { id?: string }) =>
      Promise.resolve({ id, nickName: 'sandor' }),
    ),
    find: jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: 'user1',
          nickName: 'sandor',
        },
        {
          id: 'user2',
          nickName: 'Janos',
        },
      ]),
    ),
    update: jest.fn().mockImplementation(() => ({
      raw: 'SQL Result',
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it.skip('should create a user successfully', async () => {
      const result = await service.createUser(createUserDto);

      expect(result).toEqual({
        id: 'userId',
        ...createUserDto,
      });

      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(createUserDto);
    });

    it('should return error if repository create function throws error', async () => {
      jest.spyOn(repository, 'create').mockImplementationOnce(() => {
        throw new Error('Create method failed');
      });

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        'Create method failed',
      );
    });
  });

  describe('findAllUsers', () => {
    it('should return all users successfully', async () => {
      const result = await service.findAllUsers();

      expect(result).toEqual([
        {
          id: 'user1',
          nickName: 'sandor',
        },
        {
          id: 'user2',
          nickName: 'Janos',
        },
      ]);

      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findUser', () => {
    it('should return user with id', async () => {
      const result = await service.findUser('user1');

      expect(result).toEqual({
        id: 'user1',
        nickName: 'sandor',
      });

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'user1' });
    });
  });

  describe('updateUser', () => {
    it('should return update result if update is successful', async () => {
      const result = await service.updateUser('user1', { lastName: 'Janos' });

      expect(result).toEqual({
        raw: 'SQL Result',
      });

      expect(repository.update).toHaveBeenCalledWith(
        { id: 'user1' },
        { lastName: 'Janos' },
      );
    });
  });
  // TODO add removeUser tests
});
