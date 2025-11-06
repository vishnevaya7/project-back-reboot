# Централизованная система Swagger документации

Эта система позволяет управлять Swagger документацией централизованно, вынося все декораторы из основного кода контроллеров.

## Структура

```
src/swagger/
├── swagger.config.ts           # Основная конфигурация Swagger
├── decorators/                 # Декораторы для контроллеров
│   ├── common.decorators.ts    # Базовые декораторы
│   ├── auth.decorators.ts      # Декораторы для аутентификации
│   ├── order.decorators.ts     # Декораторы для заказов
│   └── product-image.decorators.ts # Декораторы для изображений
├── schemas/                    # Схемы ответов API
│   ├── auth.schemas.ts         # Схемы для аутентификации
│   ├── order.schemas.ts        # Схемы для заказов
│   └── product-image.schemas.ts # Схемы для изображений
├── index.ts                    # Центральный экспорт
└── README.md                   # Эта документация
```

## Использование

### 1. Импорт декораторов

```typescript
import { 
  ApiCreateOrder, 
  ApiGetOrderById, 
  ApiGetAllOrders 
} from '../swagger';
```

### 2. Применение в контроллерах

```typescript
@Controller('order')
export class OrderController {
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCreateOrder()  // Вместо множества @Api* декораторов
  async create(@Body() createOrderDto: CreateOrderDto) {
    // логика
  }
}
```

## Базовые декораторы

### Авторизация
- `@ApiAuth()` - добавляет Bearer авторизацию
- `@ApiAuthEndpoint()` - авторизация + стандартные ошибки авторизации
- `@ApiAdminEndpoint()` - авторизация + ошибки админских прав

### Стандартные ответы
- `@ApiCommonResponses()` - базовые ошибки (400, 500)
- `@ApiAuthResponses()` - ошибки авторизации (401) + базовые
- `@ApiAdminResponses()` - ошибки админских прав (401, 403) + базовые

## Создание новых декораторов

### 1. Создайте схему ответа (если нужно)

```typescript
// src/swagger/schemas/my-module.schemas.ts
export class MyResponseSchema {
  @ApiProperty({ example: 'success' })
  status: string;
}
```

### 2. Создайте декоратор

```typescript
// src/swagger/decorators/my-module.decorators.ts
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MyResponseSchema } from '../schemas/my-module.schemas';
import { ApiCommonResponses } from './common.decorators';

export const ApiMyEndpoint = () => applyDecorators(
  ApiOperation({ summary: 'Мой эндпоинт' }),
  ApiResponse({
    status: 200,
    description: 'Успешный ответ',
    type: MyResponseSchema
  }),
  ApiCommonResponses()
);
```

### 3. Экспортируйте в index.ts

```typescript
// src/swagger/index.ts
export * from './decorators/my-module.decorators';
export * from './schemas/my-module.schemas';
```

## Преимущества

✅ **Чистый код** - контроллеры содержат только бизнес-логику  
✅ **Централизация** - вся Swagger документация в одном месте  
✅ **Переиспользование** - базовые декораторы для типовых случаев  
✅ **Расширяемость** - легко добавлять новые декораторы  
✅ **Консистентность** - единообразие в документации  
✅ **Поддержка** - легко изменять документацию глобально  

## Миграция существующих контроллеров

1. Найдите подходящий декоратор в `src/swagger/decorators/`
2. Замените множественные `@Api*` декораторы одним
3. Удалите неиспользуемые импорты из `@nestjs/swagger`
4. Добавьте импорт из `../swagger`

### Пример миграции

**До:**
```typescript
@ApiOperation({ summary: 'Создать заказ' })
@ApiBearerAuth()
@ApiResponse({ status: 201, description: 'Заказ создан' })
@ApiResponse({ status: 401, description: 'Не авторизован' })
@ApiResponse({ status: 400, description: 'Неверные данные' })
async create() { }
```

**После:**
```typescript
@ApiCreateOrder()
async create() { }
```
