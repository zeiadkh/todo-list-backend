import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRequest } from 'src/tasks/tasks.controller';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('jwt'))
  @Post('login')
  async login(@Request() req: UserRequest) {
    return req.user;
  }
}