import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';
import { ActivityType } from './../../common/enums/action-type.enum';

export class FilterStudentActivityDto extends PaginationDto {
  @ApiProperty({ description: 'Student id', example: 'xxxxx xxxxx xxxxx' })
  @IsString()
  @IsOptional()
  student_id: string;

  @ApiProperty({ description: 'Word id', example: 'class1' })
  @IsString()
  @IsOptional()
  word_id: string;

  @ApiProperty({ description: 'Student Action', example: ActivityType.Read, required: false })
  @IsEnum(ActivityType, { message: `Action must be one of: ${Object.values(ActivityType).join(', ')}`, })
  @IsOptional()
  action: ActivityType;
}
