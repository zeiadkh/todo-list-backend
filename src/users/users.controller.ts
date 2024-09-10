import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  BadRequestException,
  Get,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { User } from './user.entity'
import { AuthService } from '../auth/auth.service'
import { JwtStrategy } from 'src/auth/jwt.strategy'
import { IsEmail, IsString, IsNotEmpty, IsOptional, isArray } from 'class-validator'
import { Task } from 'src/tasks/task.entity'
import { UserRequest } from 'src/tasks/tasks.controller'
import { AuthGuard } from '@nestjs/passport'
import * as bcrypt from "bcryptjs"

export class UserValidatior extends User {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  confirmPassword: string

  tasks: Task[] | []
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() user: UserValidatior): Promise<any> {
    const existingUser = await this.usersService.findByUsername(user.username)
    const confirmPassword = user.password === user.confirmPassword
    if (!confirmPassword) throw new BadRequestException("Passord & confirmed Password didn't match")

    if (existingUser) {
      throw new BadRequestException('Username is already taken')
    }
    user = { ...user, tasks: [], password: bcrypt.hashSync(user.password)}
    return this.usersService.createUser(user)
  }



  @Post('login')
  @UseGuards(JwtStrategy)
  async login(
    @Body() user: { username: string; password: string },
  ): Promise<{ access_token: string }> {
    return this.authService.validateUser(user.username, user.password)
  }
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllUsers(@Request() req: UserRequest): Promise<User | undefined> {
    return this.usersService.findByUsername(req.user.username)
  }
}
