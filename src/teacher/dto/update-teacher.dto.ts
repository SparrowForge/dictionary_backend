import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { CreateTeacherDto } from './create-teacher.dto';

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {
  @ApiProperty({ description: 'User id', example: 'xxxxx xxxxx xxxxx', })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ description: 'Teacher designation', example: 'Some Designation', })
  @IsString()
  @IsOptional()
  designation: string;
}
