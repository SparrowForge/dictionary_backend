import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, } from 'class-validator';
import { ActivityType } from './../../common/enums/action-type.enum';

export class CreateStudentActivityDto {
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
  created_by: string;
}
