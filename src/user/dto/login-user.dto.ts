import { IsEmail, IsNotEmpty, IsString } from 'class-validator';


export class LoginUserDto {

    @IsNotEmpty({ message: 'Email обязателен' })
    @IsEmail({}, { message: 'Некорректный формат email' })
    email: string;


    @IsNotEmpty({ message: 'Пароль обязателен' })
    @IsString({ message: 'Пароль должен быть строкой' })
    password: string;
}
