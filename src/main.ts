import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const corsOptions: CorsOptions = {
    origin: ['https://todoz-zk.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(corsOptions);

  // app.use(
  //   session({
  //     secret: configService.get<string>('JWT_SECRET') ,
  //     resave: false,
  //     saveUninitialized: false,
  //     cookie: { secure: false }, // Adjust based on your environment
  //   })
  // );

  // app.use(passport.initialize());
  // app.use(passport.session());

  const options = new DocumentBuilder()
    .setTitle('Your API')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('auth')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get("BACKEND_PORT"));
}

bootstrap();