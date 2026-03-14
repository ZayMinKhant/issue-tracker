import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getAllowedOrigins } from './config/cors';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);

  app.enableCors({
    origin: getAllowedOrigins(),
  });

  app.useGlobalPipes(new ZodValidationPipe());

  await app.listen(port);
  console.log(`API running on http://localhost:${port}`);
}
bootstrap();
