import { ApiProperty } from '@nestjs/swagger';

import { AuthResponseDto } from './auth-response.dto';

export class UserDataDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'user' })
  role: string;
}

export class LoginResponseDto extends AuthResponseDto {
  @ApiProperty({ type: () => UserDataDto })
  user: UserDataDto;

  @ApiProperty({ example: '2023-12-31T23:59:59Z' })
  expiresAt: string;
}
