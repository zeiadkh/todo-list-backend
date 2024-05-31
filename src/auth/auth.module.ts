
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule,  } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
// process.env.SECRET_KEY = 'seckeykeysecret'

import { UsersController } from 'src/users/users.controller';
import { config } from 'dotenv';
import { ConfigModule } from '@nestjs/config';
// console.log('seckey', process.env.SECRET_KEY)
@Module({
  imports: [
    JwtModule.register({
      // Adjust the expiration time as needed
    }),
    ConfigModule,
    UsersModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [UsersController],
  exports: [AuthService],
})
export class AuthModule {}
