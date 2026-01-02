import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, } from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({ description: 'User id', example: 'xxxxx xxxxx xxxxx', })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ description: 'Teacher designation', example: 'Some Designation', })
  @IsString()
  @IsOptional()
  designation: string;
}
