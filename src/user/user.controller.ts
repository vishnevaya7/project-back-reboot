
import {BadRequestException, Body, Controller, Get, Param, Post, Req, UnauthorizedException} from "@nestjs/common";
import {CreateUserDto} from "./dto/create_user.dto";
import {UserService} from "./user.service";
import {LoginUserDto} from "./dto/login_user.dto";


@Controller('auth')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        try {
            const user = await this.userService.create(createUserDto);

            // Не возвращаем пароль в ответе
            const { password_hash, ...result } = user;
            return {
                message: 'User registered successfully',
                user: result
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        try {
            const user = await this.userService.findByEmail(loginUserDto.email);

            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const isPasswordValid = await this.userService.validatePassword(
                user,
                loginUserDto.password
            );

            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // Здесь будет генерация JWT токена
            const { password_hash, ...userData } = user;
            return {
                message: 'Login successful',
                user: userData
            };
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    // ПРОФИЛЬ (будет защищено авторизацией)
    @Get('profile')
    async getProfile(@Req() req) {
        return { message: 'Profile endpoint - add JWT guard later' };
    }
}