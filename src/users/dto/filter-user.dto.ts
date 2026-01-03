import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';
import { Status } from '../../common/enums';
import { RolesEnum } from 'src/common/enums/role.enum';

export class FilterUserDto extends PaginationDto {

  @ApiProperty({ description: 'Filter by phone_no', required: false, })
  @IsOptional()
  @IsString()
  phone_no?: string;

  @ApiProperty({ description: 'Filter by status', enum: Status, required: false, })
  @IsOptional()
  @IsEnum(Status, { message: 'status must be either active or inactive' })
  status: Status;

  @ApiProperty({ description: 'User Roles', example: 'STUDENT', enum: RolesEnum, required: false, })
  @IsEnum(RolesEnum, { message: 'Roles must be either ADMIN, TEACHER or STUDENT' })
  @IsOptional()
  role: RolesEnum;

  @ApiProperty({ description: 'Filter by department', required: false, })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({
    description: 'Search term for name, email, or username',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
