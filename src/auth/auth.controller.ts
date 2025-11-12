import {Controller, Post, Body, Get, UseGuards, Req, Query} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {AuthService} from './auth.service';
import {JwtAuthGuard} from './guards/jwt-auth.guard';
import {RolesGuard} from './guards/roles.guard';
import {Roles} from './decorators/roles.decorator';
import {UserRole} from '../user/entities/user.entity';
import {
    RegisterRequest,
    LoginRequest,
    AuthResponse,
    ProfileResponse,
    AdminDataResponse,
    RegisterResponse, UserListItemResponse, GetUserPredicate,
} from "../swagger/dto";
import {
    ApiRegister,
    ApiLogin,
    ApiGetProfile,
    ApiGetAdminData
} from '../swagger';
import {Page} from "../swagger/dto/page";
import {UserService} from "../user/user.service";
import {Pageable} from "../swagger/dto/pageable";

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService:UserService) {
    }

    @Post('register')
    @ApiRegister()
    async register(@Body() registerRequest: RegisterRequest): Promise<RegisterResponse> {
        return this.authService.register(registerRequest);
    }

    @Post('login')
    @ApiLogin()
    async login(@Body() loginRequest: LoginRequest): Promise<AuthResponse> {
        const user = await this.authService.validateUser(
            loginRequest.email,
            loginRequest.password,
        );
        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiGetProfile()
    getProfile(@Req() req): ProfileResponse {
        return {
            message: 'Профиль пользователя',
            user: req.user,
        };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('admin')
    @ApiGetAdminData()
    getAdminData(@Req() req): AdminDataResponse {
        return {
            message: 'Данные только для админов',
            user: req.user,
        };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('user')
    @ApiOperation({
        summary: 'Получить список пользователей',
        description: 'Получение списка пользователей с пагинацией и сортировкой. Доступно только администраторам.'
    })
    @ApiResponse({
        status: 200,
        description: 'Список пользователей успешно получен',
        type: Page<UserListItemResponse>
    })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 403, description: 'Недостаточно прав доступа' })
    async getUsers(@Query() req: Pageable & GetUserPredicate): Promise<Page<UserListItemResponse>> {

        const pageable: Pageable = {
            page: req.page ? Number(req.page) : 1,
            size: req.size ? Number(req.size) : 10,
            sort: req.sort
        };

        const predicate: GetUserPredicate = {
            emails: req.emails,
            emailLike: req.emailLike,
            ids: req.ids ? req.ids.map(id => Number(id)) : undefined,
            roles: req.roles,
            usernames: req.usernames,
            usernameLike: req.usernameLike,
            isActive: req.isActive
        };

        return this.userService.findUsers(pageable, predicate);
    }

}
