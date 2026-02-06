import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';
import { Status } from '../../common/enums';
import { RolesEnum } from 'src/common/enums/role.enum';

export class FilterUserDto extends PaginationDto {
  @ApiProperty({ description: 'User Roles', example: 'STUDENT', enum: RolesEnum, required: false, })
  @IsEnum(RolesEnum, { message: 'Roles must be either ADMIN, TEACHER or STUDENT' })
  @IsOptional()
  role: RolesEnum;

  @ApiProperty({ description: 'Filter by phone_no', required: false, })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Filter by department', required: false, })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Filter by phone_no', required: false, })
  @IsOptional()
  @IsString()
  phone_no?: string;

  @ApiProperty({ description: 'Filter by status', enum: Status, required: false, })
  @IsOptional()
  @IsEnum(Status, { message: 'status must be either active or inactive' })
  status: Status;

  //===========================
  @ApiProperty({ description: 'Class id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', })
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
