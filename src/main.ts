import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // whitelist: true, TODO: Add these back
      // forbidNonWhitelisted: true,
    }),
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cookieParser());
  app.enableCors({
    // TODO: remove for non testing
    origin: 'http://localhost:5173', // frontend origin
    credentials: true, // needed for cookies
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
