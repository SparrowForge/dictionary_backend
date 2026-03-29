import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Email verification token',
    example: '7d9ff22e-25bc-4e9d-8b3d-829a02dbd7e7',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
