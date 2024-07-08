import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CLIENT_ENDPOINT } from './utils/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: CLIENT_ENDPOINT,
  });

  await app.listen(3000);
}
bootstrap();
