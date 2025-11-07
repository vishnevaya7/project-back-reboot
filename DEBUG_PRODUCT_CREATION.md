# Отладка ошибки создания товара

## Проблема
Ошибка 500 при создании товара через API.

## Возможные причины

### 1. Миграция БД не применена
Добавлены поля `createdAt`/`updatedAt` в Product entity, но миграция не применена в БД.

**Решение:**
```bash
# Применить миграцию
docker-compose --profile migration up liquibase
# или
./migrate.sh
```

### 2. Проблема с авторизацией
Создание товара требует JWT токен + роль ADMIN.

**Проверить:**
- Пользователь авторизован?
- Пользователь имеет роль `admin`?
- JWT токен валидный?

### 3. Проблема с валидацией данных
Проверить структуру отправляемых данных.

**Ожидаемая структура:**
```json
{
  "name": "iPhone 15",
  "description": "Новый iPhone с улучшенной камерой",
  "price": 99999,
  "count": 10
}
```

## Шаги отладки

### Шаг 1: Проверить логи сервера
Посмотреть детальную ошибку в консоли NestJS сервера.

### Шаг 2: Проверить структуру БД
```sql
\d store.product
```

Должны быть поля:
- id, name, description, price, count
- created_at, updated_at (после миграции)

### Шаг 3: Проверить авторизацию
```bash
# Получить JWT токен через /api/auth/login
# Проверить роль пользователя
```

### Шаг 4: Тестировать через Swagger
Открыть http://localhost:3000/api/docs и протестировать API.

## Быстрое исправление

Если проблема в миграции, временно можно убрать поля из transformProductToResponse:

```typescript
private transformProductToResponse(product: Product): ProductResponse {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    count: product.count,
    // Временно закомментировать до применения миграции
    // createdAt: product.createdAt.toISOString(),
    // updatedAt: product.updatedAt.toISOString()
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
```
