# Руководство по миграции на новую систему DTO

## Обзор изменений

Выполнена полная миграция с Entity классов и базовых DTO на централизованную систему DTO с говорящими названиями.

## Что изменилось

### ✅ Создана новая структура DTO

```
src/swagger/dto/
├── auth.dto.ts      # Аутентификация
├── product.dto.ts   # Товары
├── order.dto.ts     # Заказы
├── user.dto.ts      # Пользователи
├── index.ts         # Экспорт всех DTO
└── README.md        # Документация
```

### ✅ Обновленные контроллеры

- **ProductController** - использует `CreateProductRequest`, `ProductResponse`
- **AuthController** - использует `RegisterRequest`, `LoginRequest`, `AuthResponse`
- **OrderController** - использует `CreateOrderRequest`, `OrderResponse`

### ✅ Обновленные Swagger декораторы

Все декораторы в `src/swagger/decorators/` обновлены для использования новых DTO.

## Соглашения об именовании

### Request DTO (входящие данные)
- `CreateXxxRequest` - создание ресурса
- `UpdateXxxRequest` - обновление ресурса
- `LoginRequest` - вход в систему
- `RegisterRequest` - регистрация

### Response DTO (исходящие данные)
- `XxxResponse` - основной ответ
- `XxxListResponse` - список ресурсов
- `CreateXxxResponse` - ответ при создании
- `DeleteXxxResponse` - ответ при удалении
- `XxxNotFoundResponse` - ошибка "не найден"

## Примеры миграции

### Старый код ❌
```typescript
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';

async createProduct(@Body() dto: CreateProductDto): Promise<Product> {
  return this.service.create(dto);
}
```

### Новый код ✅
```typescript
import { CreateProductRequest, ProductResponse } from '../swagger/dto';

async createProduct(@Body() request: CreateProductRequest): Promise<ProductResponse> {
  return this.service.create(request);
}
```

## Преимущества новой системы

1. **Говорящие названия** - сразу понятно назначение DTO
2. **Четкое разделение** Request/Response типов
3. **Независимость от Entity** - DTO не зависят от структуры БД
4. **Централизованное управление** - все DTO в одном месте
5. **Полная типизация** TypeScript + валидация
6. **Автоматическая Swagger документация**

## Что нужно сделать при добавлении нового модуля

1. Создать DTO в `src/swagger/dto/new-module.dto.ts`
2. Добавить экспорт в `src/swagger/dto/index.ts`
3. Создать декораторы в `src/swagger/decorators/new-module.decorators.ts`
4. Использовать новые DTO в контроллере

## Обратная совместимость

Старые DTO в модулях (`src/*/dto/`) пока остаются для обратной совместимости, но рекомендуется постепенно мигрировать на новую систему.

## Валидация

Все Request DTO содержат полную валидацию через class-validator:

```typescript
export class CreateProductRequest {
  @IsString()
  @IsNotEmpty({ message: 'Название товара не может быть пустым' })
  name: string;

  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Min(0, { message: 'Цена не может быть отрицательной' })
  price: number;
}
```

## Swagger документация

Все DTO содержат полные `@ApiProperty` декораторы:

```typescript
export class ProductResponse {
  @ApiProperty({ example: 1, description: 'ID товара' })
  id: number;

  @ApiProperty({ example: 'iPhone 15', description: 'Название товара' })
  name: string;
}
```

## Заключение

Миграция завершена успешно. Новая система DTO обеспечивает:
- Лучшую читаемость кода
- Более четкую архитектуру
- Упрощенную поддержку
- Автоматическую документацию API
