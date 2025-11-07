import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { RegisterRequest, AuthResponse, RegisterResponse } from '../swagger/dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const isPasswordValid = await this.userService.validatePassword(user, password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Аккаунт деактивирован');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(user: User): Promise<AuthResponse> {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      username: user.username 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      }
    };
  }

  async register(registerRequest: RegisterRequest): Promise<RegisterResponse> {
    const user = await this.userService.create(registerRequest);
    return this.login(user);
  }
}
