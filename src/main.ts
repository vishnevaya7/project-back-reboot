import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerConfig } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Глобальный префикс для API
  app.setGlobalPrefix('api');

  // Настройка статической раздачи файлов
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Настройка CORS
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:3000'], // Angular и другие фронтенды
    credentials: true,
  });

  // Глобальная валидация
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Настройка Swagger через централизованную конфигурацию
  SwaggerConfig.setup(app);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`  Приложение запущено на http://localhost:${port}`);
  console.log(`  Swagger документация доступна на http://localhost:${port}/api/docs`);
}

bootstrap();
