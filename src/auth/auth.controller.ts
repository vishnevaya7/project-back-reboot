import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { 
  RegisterRequest, 
  LoginRequest, 
  AuthResponse, 
  ProfileResponse, 
  AdminDataResponse,
  RegisterResponse 
} from "../swagger/dto";
import { 
  ApiRegister, 
  ApiLogin, 
  ApiGetProfile, 
  ApiGetAdminData 
} from '../swagger';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
