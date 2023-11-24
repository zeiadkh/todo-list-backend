// src/users/users.controller.ts

import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: User): Promise<User> {
    const existingUser = await this.usersService.findByUsername(user.username);

    if (existingUser) {
      throw new BadRequestException('Username is already taken');
    }

    return this.usersService.createUser(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() user: User): Promise<{ access_token: string }> {
    return this.authService.login(user);
  }
}
