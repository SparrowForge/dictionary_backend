import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { CreateStudentActivityDto } from './create-student-activity.dto';
import { ActivityType } from 'src/common/enums/action-type.enum';

export class UpdateStudentActivityDto extends PartialType(CreateStudentActivityDto) {
  @ApiProperty({ description: 'Student id', example: 'xxxxx xxxxx xxxxx' })
  @IsString()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({ description: 'Word id', example: 'class1' })
  @IsString()
  @IsNotEmpty()
  word_id: string;

  @ApiProperty({ description: 'Student Action', example: ActivityType.Read, required: false })
  @IsEnum(ActivityType, { message: `Action must be one of: ${Object.values(ActivityType).join(', ')}`, })
  @IsOptional()
  action: ActivityType;

  @ApiProperty({ description: 'Created by user id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', })
  @IsString()
  @IsOptional()
  updated_by: string;
}
