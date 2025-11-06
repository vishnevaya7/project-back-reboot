import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseSchema {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT токен' })
  access_token: string;

  @ApiProperty({
    example: {
      id: 1,
      email: 'user@example.com',
      firstName: 'Иван',
      lastName: 'Иванов',
      role: 'USER'
    },
    description: 'Данные пользователя'
  })
  user: object;
}

export class ProfileResponseSchema {
  @ApiProperty({ example: 'Профиль пользователя' })
  message: string;

  @ApiProperty({
    example: {
      id: 1,
      email: 'user@example.com',
      firstName: 'Иван',
      lastName: 'Иванов',
      role: 'USER'
    }
  })
  user: object;
}

export class AdminDataResponseSchema {
  @ApiProperty({ example: 'Данные только для админов' })
  message: string;

  @ApiProperty({
    example: {
      id: 1,
      email: 'admin@example.com',
      firstName: 'Админ',
      lastName: 'Админов',
      role: 'ADMIN'
    }
  })
  user: object;
}
