import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { Status } from '../../common/enums';
import { CreateUserDto } from './create-user.dto';
import { RolesEnum } from 'src/common/enums/role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {

  @ApiProperty({ description: 'User email', example: 'admin@solocrest.com', })
  @IsString()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'User name', example: 'solocrest', })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'User password', example: 'qwerty', })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'User phone number', example: '+880', required: false, })
  @IsOptional()
  phone_no?: string;

  @ApiProperty({ description: 'User Roles', example: 'STUDENT', enum: RolesEnum, })
  @IsEnum(RolesEnum, { message: 'Roles must be either ADMIN, TEACHER or STUDENT' })
  @IsString()
  @IsOptional()
  role?: RolesEnum;

  @ApiProperty({ description: 'User status', example: 'active', enum: Status, })
  @IsEnum(Status, { message: 'status must be either active or inactive' })
  @IsOptional()
  status?: Status = Status.ACTIVE;

  @ApiProperty({ description: 'Updated by user id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', })
  @IsString()
  @IsOptional()
  updated_by?: string;

  //===========================
  @ApiProperty({ description: 'Image file id', example: 10, })
  @IsNumber()
  @IsOptional()
  image_file_id?: number;

  @ApiProperty({ description: 'Class id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', })
  @IsUUID()
  @IsOptional()
  class_id?: string;

  @ApiProperty({ description: 'Student section', example: 'A', required: false, })
  @IsString()
  @IsOptional()
  section?: string;

  @ApiProperty({ description: 'Student roll_number', example: '001ction', required: false, })
  @IsString()
  @IsOptional()
  roll_number?: string;

}
