# Централизованная система DTO

Эта папка содержит все DTO (Data Transfer Objects) с говорящими названиями, разделенные на Request и Response типы.

## Структура

```
src/swagger/dto/
├── auth.dto.ts      # DTO для аутентификации
├── product.dto.ts   # DTO для товаров  
├── order.dto.ts     # DTO для заказов
├── user.dto.ts      # DTO для пользователей
├── index.ts         # Экспорт всех DTO
└── README.md        # Эта документация
```

## Соглашения об именовании

### Request DTO (входящие данные)
- `CreateXxxRequest` - для создания ресурса
- `UpdateXxxRequest` - для обновления ресурса  
- `LoginRequest` - для входа в систему
- `RegisterRequest` - для регистрации

### Response DTO (исходящие данные)
- `XxxResponse` - основной ответ с данными ресурса
- `XxxListResponse` - список ресурсов
- `CreateXxxResponse` - ответ при создании ресурса
- `UpdateXxxResponse` - ответ при обновлении ресурса
- `DeleteXxxResponse` - ответ при удалении ресурса
- `XxxNotFoundResponse` - ошибка "не найден"

## Примеры использования

### В контроллерах

```typescript
import { CreateProductRequest, ProductResponse } from '../swagger/dto';

@Controller('products')
export class ProductController {
  @Post()
  async create(@Body() createProductRequest: CreateProductRequest): Promise<ProductResponse> {
    // логика создания товара
  }
}
```

### В Swagger декораторах

```typescript
import { CreateProductRequest, ProductResponse } from '../dto/product.dto';

export const ApiCreateProduct = () => applyDecorators(
  ApiBody({ type: CreateProductRequest }),
  ApiResponse({
    status: 201,
    description: 'Товар создан',
    type: ProductResponse
  })
);
```

## Преимущества

1. **Говорящие названия** - сразу понятно назначение DTO
2. **Четкое разделение** Request/Response типов
3. **Централизованное управление** - все DTO в одном месте
4. **Независимость от Entity** - DTO не зависят от структуры БД
5. **Полная типизация** TypeScript + валидация class-validator
6. **Автоматическая Swagger документация**

## Миграция с старых DTO

Старые импорты Entity классов и базовых DTO нужно заменить на новые:

```typescript
// Старый способ ❌
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';

// Новый способ ✅  
import { CreateProductRequest, ProductResponse } from '../swagger/dto';
```

## Валидация

Все Request DTO содержат декораторы валидации:

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

Все DTO содержат полные `@ApiProperty` декораторы с примерами:

```typescript
export class ProductResponse {
  @ApiProperty({ example: 1, description: 'ID товара' })
  id: number;

  @ApiProperty({ example: 'iPhone 15', description: 'Название товара' })
  name: string;
}
```
