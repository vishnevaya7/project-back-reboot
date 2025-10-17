import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'Имя пользователя обязательно' })
    @IsString({ message: 'Имя пользователя должно быть строкой' })
    username: string;

    @IsNotEmpty({ message: 'Email обязателен' })
    @IsEmail({}, { message: 'Некорректный формат email' })
    email: string;

    @IsNotEmpty({ message: 'Пароль обязателен' })
    @IsString({ message: 'Пароль должен быть строкой' })
    @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
    password: string;
}
