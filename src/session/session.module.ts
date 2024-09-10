import { Module } from '@nestjs/common';
import * as session from 'express-session';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [ConfigModule],

  providers: [
    {
      provide: 'SESSION',
      useFactory: (configService: ConfigService) => {

        return session({
          secret: configService.get('JWT_SECRET'),
          resave: false,
          saveUninitialized: false,
          cookie: { secure: false }, // Adjust this based on your environment (e.g., true for HTTPS)
        
        });
      },
    inject: [ConfigService],
    },
  ],
  exports: ['SESSION'],
})
export class SessionModule {}
