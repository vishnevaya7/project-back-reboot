import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { LoginUserDto } from '../../user/dto/login-user.dto';
import { LoginResponseSchema, ProfileResponseSchema, AdminDataResponseSchema } from '../schemas/auth.schemas';
import { ApiAuth, ApiCommonResponses, ApiAuthResponses, ApiAdminResponses } from './common.decorators';

export const ApiRegister = () => applyDecorators(
  ApiOperation({ summary: 'Регистрация нового пользователя' }),
  ApiBody({ type: CreateUserDto }),
  ApiResponse({ status: 201, description: 'Пользователь успешно зарегистрирован' }),
  ApiResponse({ status: 409, description: 'Пользователь уже существует' }),
  ApiCommonResponses()
);

export const ApiLogin = () => applyDecorators(
  ApiOperation({ summary: 'Вход в систему' }),
  ApiBody({ type: LoginUserDto }),
  ApiResponse({
    status: 200,
    description: 'Успешная авторизация',
    type: LoginResponseSchema
  }),
  ApiResponse({ status: 401, description: 'Неверные учетные данные' }),
  ApiCommonResponses()
);

export const ApiGetProfile = () => applyDecorators(
  ApiAuth(),
  ApiOperation({ summary: 'Получить профиль текущего пользователя' }),
  ApiResponse({
    status: 200,
    description: 'Профиль пользователя',
    type: ProfileResponseSchema
  }),
  ApiAuthResponses()
);

export const ApiGetAdminData = () => applyDecorators(
  ApiAuth(),
  ApiOperation({ summary: 'Получить данные для администраторов' }),
  ApiResponse({
    status: 200,
    description: 'Данные для админов',
    type: AdminDataResponseSchema
  }),
  ApiAdminResponses()
);
