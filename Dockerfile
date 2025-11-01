# Используем Node.js 22 Alpine для меньшего размера образа
FROM node:22-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем ВСЕ зависимости (включая dev) для сборки
RUN npm ci && npm cache clean --force

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Продакшн образ
FROM node:22-alpine AS production

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости (включая @nestjs/swagger для runtime)
RUN npm ci --omit=dev && npm cache clean --force

# Копируем собранное приложение из builder этапа
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Переключаемся на пользователя nestjs
USER nestjs

# Открываем порт 3000
EXPOSE 3000

# Команда запуска приложения
CMD ["node", "dist/main.js"]
