import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { Status } from '../../common/enums';
import { CreateUserDto } from './create-user.dto';
import { RolesEnum } from 'src/common/enums/role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {

  @ApiProperty({ description: 'User email', example: 'admin@solocrest.com', })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User name', example: 'solocrest', })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'User password', example: 'qwerty', })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'User phone number', example: '+880', required: false, })
  @IsOptional()
  phone_no?: string;

  @ApiProperty({ description: 'User Roles', example: 'STUDENT', enum: RolesEnum, })
  @IsEnum(RolesEnum, { message: 'Roles must be either ADMIN, TEACHER or STUDENT' })
  @IsString()
  @IsNotEmpty()
  role: RolesEnum;

  @ApiProperty({ description: 'User status', example: 'active', enum: Status, })
  @IsEnum(Status, { message: 'status must be either active or inactive' })
  @IsOptional()
  status?: Status = Status.ACTIVE;
}
