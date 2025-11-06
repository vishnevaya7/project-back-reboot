import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export class SwaggerConfig {
  static setup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('E-commerce API')
      .setDescription('API для интернет-магазина')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Введите JWT токен',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Аутентификация', 'Регистрация, авторизация и управление пользователями')
      .addTag('Товары', 'Управление товарами')
      .addTag('Изображения товаров', 'Загрузка и управление изображениями товаров')
      .addTag('Заказы', 'Создание и управление заказами')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }
}
