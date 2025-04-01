import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.createUser(createUserDto);
      return { message: 'User created successfully', user };
    } catch (error) {
      throw new BadRequestException('User creation failed: ' + error);
    }
  }

  @Get()
  async findAll() {
    try {
      const user = await this.userService.findAllUsers();
      return { users: user };
    } catch (error) {
      throw new BadRequestException('User request failed: ' + error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.userService.findUser(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException('User request failed: ' + error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.userService.updateUser(id, updateUserDto);
    } catch (error) {
      throw new BadRequestException('Error while updating user' + error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.userService.removeUser(id);
    } catch (error) {
      throw new BadRequestException('Error while deleting user' + error);
    }
  }
}
