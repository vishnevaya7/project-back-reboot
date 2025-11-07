import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { 
  RegisterRequest, 
  LoginRequest, 
  AuthResponse, 
  ProfileResponse, 
  AdminDataResponse,
  RegisterResponse
} from '../dto/auth.dto';
import { ApiAuth, ApiCommonResponses, ApiAuthResponses, ApiAdminResponses } from './common.decorators';

export const ApiRegister = () => applyDecorators(
  ApiOperation({ summary: 'Регистрация нового пользователя' }),
  ApiBody({ type: RegisterRequest }),
  ApiResponse({ 
    status: 201, 
    description: 'Пользователь успешно зарегистрирован',
    type: RegisterResponse
  }),
  ApiResponse({ status: 409, description: 'Пользователь уже существует' }),
  ApiCommonResponses()
);

export const ApiLogin = () => applyDecorators(
  ApiOperation({ summary: 'Вход в систему' }),
  ApiBody({ type: LoginRequest }),
  ApiResponse({
    status: 200,
    description: 'Успешная авторизация',
    type: AuthResponse
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
    type: ProfileResponse
  }),
  ApiAuthResponses()
);

export const ApiGetAdminData = () => applyDecorators(
  ApiAuth(),
  ApiOperation({ summary: 'Получить данные для администраторов' }),
  ApiResponse({
    status: 200,
    description: 'Данные для админов',
    type: AdminDataResponse
  }),
  ApiAdminResponses()
);
