import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { CreateStudentsDto } from './create-students.dto';

export class UpdateStudentsDto extends PartialType(CreateStudentsDto) {
  @ApiProperty({ description: 'User id', example: 'xxxx xxxx xxxxx xxx', required: true })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ description: 'Student id card number', example: '012546', required: false })
  @IsString()
  @IsOptional()
  student_id: string;

  @ApiProperty({ description: 'Class id', example: 'xxxx xxxx xxxxx xxx', required: false })
  @IsString()
  @IsOptional()
  class_id: string;

  @ApiProperty({ description: 'Profile image id', example: 100, required: false })
  @IsNumber()
  @IsOptional()
  profile_image_id: number;

  @ApiProperty({ description: 'Created by user id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', })
  @IsString()
  @IsOptional()
  updated_by: string;
}
