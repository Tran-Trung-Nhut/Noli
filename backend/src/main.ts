import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser())

  app.useGlobalPipes(new ValidationPipe())

  app.enableCors({
    origin: [process.env.FRONTEND_DOMAIN_1, process.env.FRONTEND_DOMAIN_2],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  await app.listen(process.env.PORT || 10800, '0.0.0.0');
}
bootstrap();
