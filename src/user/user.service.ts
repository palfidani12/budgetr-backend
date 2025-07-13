import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../typeorm-entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const hashingSecret = process.env.PASSWORD_HASHING_SECRET;
    let hashedPassword: string;

    if (!hashingSecret) {
      throw new InternalServerErrorException(
        'Environment variable is missing (PASSWORD_HASHING_SECRET)',
      );
    }

    try {
      hashedPassword = await argon2.hash(createUserDto.password, {
        secret: Buffer.from(hashingSecret),
      });
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error while hashing password',
      );
    }

    try {
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      const savedUser: Partial<User> = await this.userRepository.save(user);
      delete savedUser.password;
      return savedUser;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error while creating user and saving',
      );
    }
  }

  async findAllUsers(): Promise<User[]> {
    try {
      const users = await this.userRepository.find();
      return users;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error while getting the users',
      );
    }
  }

  async findUser(id: string) {
    try {
      const users = await this.userRepository.findOne({
        where: { id },
        relations: ['moneyPockets'],
      });
      return users;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error while getting the user',
      );
    }
  }

  async findUserByEmail(email: string) {
    try {
      const users = await this.userRepository.findOneBy({ email });
      return users;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error while getting the user',
      );
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updateResult = await this.userRepository.update(
        { id },
        updateUserDto,
      );
      return updateResult;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error while updating the user',
      );
    }
  }

  async removeUser(id: string) {
    let userToRemove: User | null;
    try {
      userToRemove = await this.userRepository.findOneBy({ id });
    } catch (error) {
      throw new InternalServerErrorException(error, 'Failed to retrieve user');
    }

    if (!userToRemove) {
      throw new NotFoundException('User not found');
    }

    try {
      const removedUser = await this.userRepository.softRemove(userToRemove);
      return removedUser;
    } catch (error) {
      throw new InternalServerErrorException(error, 'Failed to delete user');
    }
  }
}
