import { Controller, Post, Body, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UserValidatior extends User {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  
}
interface RequestWithUser extends Request {
  user: any
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() user: UserValidatior): Promise<User> {
    const existingUser = await this.usersService.findByUsername(user.username);
    const confirmPassword = user.password === user.confirmPassword
    if (!confirmPassword) throw new BadRequestException("Passord & confirmed Password didn't match")
    
    if (existingUser) {
      throw new BadRequestException('Username is already taken');
    }

    return this.usersService.createUser(user);
  }

  
  @Post('login')
  @UseGuards(JwtStrategy)
  async login(@Body() user:{username: string, password: string}): Promise<{ access_token: string }> {
    
    // console.log()
    // At this point, req.user contains the authenticated user
    //this.authService.login(req.user);
    return this.authService.validateUser(user.username, user.password)
  }
}
