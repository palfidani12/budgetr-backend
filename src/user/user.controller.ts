import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/typeorm-entities/user.entity';

type GetProfileRequestType = {
  user: Partial<User>;
};

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('summary')
  async getUserSummary(
    @Request()
    req: {
      body: { from: string; to: string };
      user: { userId: string };
    },
  ) {
    const fromTimestamp = req.body.from;
    const toTimestamp = req.body.to;

    return await this.userService.getUserSummary(
      req.user.userId,
      fromTimestamp,
      toTimestamp,
    );
  }

  // TODO: maybe move to auth controller
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return { message: 'User created successfully', user };
  }

  @Get()
  async findAll() {
    const user = await this.userService.findAllUsers();
    return { users: user };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findUser(id);
    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updateResult = await this.userService.updateUser(id, updateUserDto);
    return updateResult;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedUser = await this.userService.removeUser(id);
    return deletedUser;
  }

  @UseGuards(JwtAuthGuard)
  @Get('getLoggedInUser')
  getLoggedInUser(@Request() req: GetProfileRequestType) {
    return req.user;
  }
}
