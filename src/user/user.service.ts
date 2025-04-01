import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../typeorm-entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  findUser(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({ id }, updateUserDto);
  }

  async removeUser(id: string) {
    const userToRemove = await this.userRepository.findOneBy({ id });
    if (!userToRemove) {
      return undefined;
    }
    return this.userRepository.softRemove(userToRemove);
  }
}
