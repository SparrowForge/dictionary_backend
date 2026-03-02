import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'newPassword123',
    description: 'The new password',
    minLength: 6,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  newPassword: string;

  @ApiProperty({
    example: 'newPassword123',
    description: 'Previous password',
    minLength: 6,
  })
  @IsString({ message: 'Confirm password must be a string' })
  @IsNotEmpty({ message: 'Confirm password is required' })
  @MinLength(6, {
    message: 'Previous password must be at least 6 characters long',
  })
  previousPassword: string;
}
