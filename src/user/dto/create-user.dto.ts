import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'Имя пользователя',
        example: 'john_doe',
        minLength: 1,
    })
    @IsNotEmpty({ message: 'Имя пользователя обязательно' })
    @IsString({ message: 'Имя пользователя должно быть строкой' })
    username: string;

    @ApiProperty({
        description: 'Email адрес пользователя',
        example: 'john@example.com',
        format: 'email',
    })
    @IsNotEmpty({ message: 'Email обязателен' })
    @IsEmail({}, { message: 'Некорректный формат email' })
    email: string;

    @ApiProperty({
        description: 'Пароль пользователя',
        example: 'password123',
        minLength: 6,
    })
    @IsNotEmpty({ message: 'Пароль обязателен' })
    @IsString({ message: 'Пароль должен быть строкой' })
    @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
    password: string;
}
