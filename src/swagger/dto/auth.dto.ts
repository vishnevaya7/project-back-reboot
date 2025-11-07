import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

// Request DTOs
export class RegisterRequest {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя'
  })
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Пароль пользователя (минимум 6 символов)'
  })
  @IsString()
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Имя пользователя (username)'
  })
  @IsString()
  @IsNotEmpty({ message: 'Username не может быть пустым' })
  username: string;
}

export class LoginRequest {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя'
  })
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Пароль пользователя'
  })
  @IsString()
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  password: string;
}

// Response DTOs
export class UserData {
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  email: string;

  @ApiProperty({ example: 'john_doe', description: 'Username пользователя' })
  username: string;

  @ApiProperty({ example: 'user', description: 'Роль пользователя', enum: ['user', 'admin'] })
  role: string;
}

export class AuthResponse {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT токен для авторизации'
  })
  access_token: string;

  @ApiProperty({
    type: UserData,
    description: 'Данные авторизованного пользователя'
  })
  user: UserData;
}

export class ProfileResponse {
  @ApiProperty({
    example: 'Профиль пользователя',
    description: 'Сообщение о статусе операции'
  })
  message: string;

  @ApiProperty({
    type: UserData,
    description: 'Данные пользователя'
  })
  user: UserData;
}

export class AdminDataResponse {
  @ApiProperty({
    example: 'Данные только для админов',
    description: 'Сообщение о статусе операции'
  })
  message: string;

  @ApiProperty({
    type: UserData,
    description: 'Данные администратора'
  })
  user: UserData;
}

export class RegisterResponse {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT токен для авторизации'
  })
  access_token: string;

  @ApiProperty({
    type: UserData,
    description: 'Данные зарегистрированного пользователя'
  })
  user: UserData;
}
