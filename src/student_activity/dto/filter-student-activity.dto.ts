import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';
import { ActivityType } from './../../common/enums/action-type.enum';

export class FilterStudentActivityDto extends PaginationDto {
  @ApiProperty({ description: 'Student ID', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', required: false })
  @IsString()
  @IsOptional()
  student_id: string;

  @ApiProperty({ description: 'Word ID', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', required: false })
  @IsString()
  @IsOptional()
  word_id: string;

  @ApiProperty({ description: 'Student activity action', example: ActivityType.Read, required: false })
  @IsEnum(ActivityType, { message: `Action must be one of: ${Object.values(ActivityType).join(', ')}`, })
  @IsOptional()
  action: ActivityType;
}
