import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';
import { Status } from '../../common/enums';

export class FilterRoleDto extends PaginationDto {
  @ApiProperty({
    description: 'Filter by status',
    example: 'active',
    enum: Status,
    required: false,
    default: Status.ACTIVE,
  })
  @IsOptional()
  @IsEnum(Status, { message: 'status must be either active or inactive' })
  status: Status = Status.ACTIVE;

  @ApiProperty({
    description: 'Filter by role name (partial match)',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Search term for role name',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
