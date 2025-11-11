import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    IsEnum,
    IsOptional,
    IsBoolean,
    IsArray,
    IsNumber
} from 'class-validator';
import {UserRole} from "../../user/entities/user.entity";
import {Transform, Type} from "class-transformer";

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

// Response DTOs для списка пользователей (минимальная информация)
export class UserListItemResponse {
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
}

// Response DTO для детальной информации о пользователе
export class UserDetailResponse {
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

  @ApiProperty({ 
    example: '2024-11-07T12:00:00.000Z', 
    description: 'Дата последнего входа в систему',
    required: false
  })
  lastLoginAt?: string;

  @ApiProperty({
    example: 5,
    description: 'Количество заказов пользователя',
    required: false
  })
  ordersCount?: number;
}

export class UserListResponse {
  @ApiProperty({
    type: [UserListItemResponse],
    description: 'Список пользователей'
  })
  users: UserListItemResponse[];

  @ApiProperty({
    example: 50,
    description: 'Общее количество пользователей'
  })
  total: number;
}

export class CreateUserResponse {
  @ApiProperty({
    example: 'Пользователь успешно создан',
    description: 'Сообщение о статусе создания пользователя'
  })
  message: string;

  @ApiProperty({
    type: UserDetailResponse,
    description: 'Созданный пользователь'
  })
  user: UserDetailResponse;
}

export class UpdateUserResponse {
  @ApiProperty({
    example: 'Пользователь успешно обновлен',
    description: 'Сообщение о статусе обновления пользователя'
  })
  message: string;

  @ApiProperty({
    type: UserDetailResponse,
    description: 'Обновленный пользователь'
  })
  user: UserDetailResponse;
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

export class GetUserPredicate {
    @ApiProperty({
        example: ['user@example.com', 'admin@example.com'],
        description: 'Массив email адресов для точного поиска',
        required: false,
        type: [String]
    })
    @IsOptional()
    @IsArray()
    @IsEmail({}, { each: true, message: 'Каждый email должен быть корректным' })
    emails?: string[];

    @ApiProperty({
        example: 'user@',
        description: 'Частичное совпадение email (LIKE поиск)',
        required: false
    })
    @IsOptional()
    @IsString()
    emailLike?: string;

    @ApiProperty({
        example: [1, 2, 3],
        description: 'Массив ID пользователей для поиска',
        required: false,
        type: [Number]
    })
    @IsOptional()
    @IsArray()
    @Type(() => Number)
    @IsNumber({}, { each: true, message: 'Каждый ID должен быть числом' })
    ids?: number[];

    @ApiProperty({
        example: ['user', 'admin'],
        description: 'Массив ролей для фильтрации',
        required: false,
        enum: ['user', 'admin'],
        isArray: true
    })
    @IsOptional()
    @IsArray()
    @IsEnum(['user', 'admin'], { each: true, message: 'Недопустимая роль' })
    roles?: string[];

    @ApiProperty({
        example: ['john_doe', 'admin_user'],
        description: 'Массив username для точного поиска',
        required: false,
        type: [String]
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true, message: 'Каждый username должен быть строкой' })
    usernames?: string[];

    @ApiProperty({
        example: 'john',
        description: 'Частичное совпадение username (LIKE поиск)',
        required: false
    })
    @IsOptional()
    @IsString()
    usernameLike?: string;

    @ApiProperty({
        example: true,
        description: 'Фильтр по активности пользователя',
        required: false
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsBoolean({ message: 'isActive должно быть boolean значением' })
    isActive?: boolean;
}


