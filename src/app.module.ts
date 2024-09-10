import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module'
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get("DATABASE_HOST"),
        port: configService.get("DATABASE_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get('DB_PASSWORD'),
        database: 'todoz-db',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        ssl: { rejectUnauthorized: false }
      })
    }),
    JwtModule.register({
      secret: process.env.SECRET_KEY, 
      signOptions: { expiresIn: '1d' }, 
    }),
    TasksModule,
    UsersModule,
    ConfigModule.forRoot({isGlobal: true}),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
