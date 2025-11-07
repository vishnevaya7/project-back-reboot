# Инструкция по применению миграции для добавления timestamps в Product

## Проблема
В Product entity добавлены поля `createdAt` и `updatedAt`, но в базе данных эти поля отсутствуют, что вызывает TypeScript ошибки.

## Решение
Создана миграция `006-add-timestamps-to-products.xml` для добавления полей в базу данных.

## Применение миграции

### Вариант 1: Через Docker Compose
```bash
# Запуск миграции
docker-compose --profile migration up liquibase

# Или через скрипт
./migrate.sh
# На Windows: migrate.bat
```

### Вариант 2: Через Liquibase напрямую (если установлен локально)
```bash
liquibase update
```

## Что добавляет миграция

1. **Поле `created_at`** - автоматически устанавливается при создании записи
2. **Поле `updated_at`** - автоматически обновляется при изменении записи  
3. **Триггер PostgreSQL** - автоматически обновляет `updated_at` при UPDATE
4. **Индекс на `created_at`** - для быстрого поиска по дате создания

## Структура после миграции

```sql
-- Таблица store.product будет содержать:
id INTEGER PRIMARY KEY
name VARCHAR(255) NOT NULL
description TEXT NOT NULL  
price DECIMAL(10,2) NOT NULL
count INTEGER NOT NULL
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
```

## Проверка применения

После применения миграции можно проверить структуру таблицы:

```sql
\d store.product
```

Или через SQL:
```sql
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_schema = 'store' AND table_name = 'product'
ORDER BY ordinal_position;
```

## Откат (если нужен)

Для отката миграции:
```bash
liquibase rollback-count 1
```
