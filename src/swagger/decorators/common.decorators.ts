import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

// Базовые декораторы для авторизации
export const ApiAuth = () => applyDecorators(
  ApiBearerAuth('JWT-auth')
);

// Стандартные ответы об ошибках
export const ApiCommonResponses = () => applyDecorators(
  ApiResponse({ status: 400, description: 'Некорректные данные запроса' }),
  ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
);

// Ответы для авторизованных эндпоинтов
export const ApiAuthResponses = () => applyDecorators(
  ApiResponse({ status: 401, description: 'Не авторизован' }),
  ApiCommonResponses()
);

// Ответы для админских эндпоинтов
export const ApiAdminResponses = () => applyDecorators(
  ApiResponse({ status: 401, description: 'Не авторизован' }),
  ApiResponse({ status: 403, description: 'Недостаточно прав доступа' }),
  ApiCommonResponses()
);

// Комбинированный декоратор для админских эндпоинтов
export const ApiAdminEndpoint = () => applyDecorators(
  ApiAuth(),
  ApiAdminResponses()
);

// Комбинированный декоратор для авторизованных эндпоинтов
export const ApiAuthEndpoint = () => applyDecorators(
  ApiAuth(),
  ApiAuthResponses()
);
