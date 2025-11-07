import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

// Request DTOs
export class CreateUserRequest {
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
    description: 'Username пользователя'
  })
  @IsString()
  @IsNotEmpty({ message: 'Username не может быть пустым' })
  username: string;

  @ApiProperty({
    example: 'user',
    description: 'Роль пользователя',
    enum: ['user', 'admin'],
    required: false,
    default: 'user'
  })
  @IsOptional()
  @IsEnum(['user', 'admin'], { message: 'Недопустимая роль пользователя' })
  role?: string;
}

export class UpdateUserRequest {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
    required: false
  })
  @IsOptional()
  @IsEmail({}, { message: 'Некорректный email' })
  email?: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Username пользователя',
    required: false
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Username не может быть пустым' })
  username?: string;

  @ApiProperty({
    example: 'user',
    description: 'Роль пользователя',
    enum: ['user', 'admin'],
    required: false
  })
  @IsOptional()
  @IsEnum(['user', 'admin'], { message: 'Недопустимая роль пользователя' })
  role?: string;
}

// Response DTOs
export class UserResponse {
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  email: string;

  @ApiProperty({ example: 'john_doe', description: 'Username пользователя' })
  username: string;

  @ApiProperty({ example: 'user', description: 'Роль пользователя', enum: ['user', 'admin'] })
  role: string;

  @ApiProperty({ example: true, description: 'Активен ли пользователь' })
  isActive: boolean;

  @ApiProperty({ example: '2024-11-07T12:00:00.000Z', description: 'Дата создания пользователя' })
  createdAt: string;

  @ApiProperty({ example: '2024-11-07T12:00:00.000Z', description: 'Дата последнего обновления пользователя' })
  updatedAt: string;
}

export class UserListResponse {
  @ApiProperty({
    type: [UserResponse],
    description: 'Список пользователей'
  })
  users: UserResponse[];
}

export class CreateUserResponse {
  @ApiProperty({
    example: 'Пользователь успешно создан',
    description: 'Сообщение о статусе создания пользователя'
  })
  message: string;

  @ApiProperty({
    type: UserResponse,
    description: 'Созданный пользователь'
  })
  user: UserResponse;
}

export class UpdateUserResponse {
  @ApiProperty({
    example: 'Пользователь успешно обновлен',
    description: 'Сообщение о статусе обновления пользователя'
  })
  message: string;

  @ApiProperty({
    type: UserResponse,
    description: 'Обновленный пользователь'
  })
  user: UserResponse;
}

export class DeleteUserResponse {
  @ApiProperty({
    example: 'Пользователь "user@example.com" успешно удален',
    description: 'Сообщение о статусе удаления'
  })
  message: string;
}

export class UserNotFoundResponse {
  @ApiProperty({
    example: 'Пользователь не найден',
    description: 'Сообщение об ошибке'
  })
  message: string;

  @ApiProperty({
    example: 404,
    description: 'Код ошибки'
  })
  statusCode: number;
}
