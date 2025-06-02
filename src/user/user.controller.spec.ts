import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserController', () => {
  let userController: UserController;
  const mockUserService = {
    createUser: jest.fn(),
    findAllUsers: jest.fn(),
    findUser: jest.fn(),
    updateUser: jest.fn(),
    removeUser: jest.fn(),
  };

  const mockUserDto = {
    firstName: 'Janos',
    lastName: 'Endrer',
    email: 'jani@gmail.com',
    password: 'hehe',
    country: 'Italy',
  } as CreateUserDto;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('create', () => {
    it('should call createUser function of userService with right dto and return result', async () => {
      mockUserService.createUser.mockResolvedValue({
        id: 'user-id',
        firstName: 'Janos',
      });

      expect(await userController.create(mockUserDto)).toEqual({
        message: 'User created successfully',
        user: {
          id: 'user-id',
          firstName: 'Janos',
        },
      });

      expect(mockUserService.createUser).toHaveBeenCalledWith(mockUserDto);
    });
  });

  describe('findAll', () => {
    it('should call findAllUsers function of userService and return result', async () => {
      mockUserService.findAllUsers.mockResolvedValue([
        {
          id: 'user-id',
          firstName: 'Janos',
        },
      ]);

      expect(await userController.findAll()).toEqual({
        users: [
          {
            id: 'user-id',
            firstName: 'Janos',
          },
        ],
      });
      expect(mockUserService.findAllUsers).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call findUser function of userService with id and return result', async () => {
      mockUserService.findUser.mockResolvedValue({
        id: 'user-id',
        firstName: 'Janos',
      });

      expect(await userController.findOne('user-id')).toEqual({
        id: 'user-id',
        firstName: 'Janos',
      });
      expect(mockUserService.findUser).toHaveBeenCalledWith('user-id');
    });
  });

  describe('update', () => {
    it('should call updateUser function of userService with id and updateUserDto and return result', async () => {
      mockUserService.updateUser.mockResolvedValue({
        msg: 'Updated successfuly',
      });

      expect(
        await userController.update('user-id', { firstName: 'Jancsi' }),
      ).toEqual({
        msg: 'Updated successfuly',
      });
      expect(mockUserService.updateUser).toHaveBeenCalledWith('user-id', {
        firstName: 'Jancsi',
      });
    });
  });

  describe('remove', () => {
    it('should call removeUser function of userService with id and return result', async () => {
      mockUserService.removeUser.mockResolvedValue({
        deletedAt: 'timestamp',
        id: 'userId',
      });

      expect(await userController.remove('userId')).toEqual({
        deletedAt: 'timestamp',
        id: 'userId',
      });
      expect(mockUserService.removeUser).toHaveBeenCalledWith('userId');
    });
  });

  describe('getLoggedInUser', () => {
    it('should call return user field of request provided by the guard', () => {
      expect(
        userController.getLoggedInUser({ user: { id: 'sandor' } }),
      ).toEqual({
        id: 'sandor',
      });
    });
  });
});
