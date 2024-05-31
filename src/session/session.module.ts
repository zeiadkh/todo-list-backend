import { Module } from '@nestjs/common';
import * as session from 'express-session';

@Module({
  providers: [
    {
      provide: 'SESSION',
      useValue: session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Adjust this based on your environment (e.g., true for HTTPS)
      }),
    },
  ],
  exports: ['SESSION'],
})
export class SessionModule {}
