import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { Status } from '../../common/enums';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Role name (max 50 characters)',
    example: 'Teacher',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Teacher role with access to course management',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Role status',
    example: 'active',
    required: false,
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status, { message: 'status must be either active or inactive' })
  status?: Status;
}
