import * as bcrypt from "bcryptjs";
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private config: ConfigService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if(!user) throw new BadRequestException("User Not found")
    if (bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return this.login(user);
    }
    throw new BadRequestException("wrong password")
    

  }

  async login(user: any): Promise<{ access_token: string }> {
    // console.log(user)
    const payload = { username: user.username, sub: user.id };
    const secret = this.config.get("JWT_SECRET");
    const access_token = await this.jwtService.signAsync(payload, { expiresIn: '3d', secret });
    return { access_token };
  }
}
