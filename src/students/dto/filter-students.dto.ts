import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterStudentsDto extends PaginationDto {
  @ApiProperty({ description: 'Student name', example: 'some one', required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'User ID', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', required: false })
  @IsString()
  @IsOptional()
  user_id: string;

  @ApiProperty({ description: 'Student id card number', example: '012546', required: false })
  @IsString()
  @IsOptional()
  student_id: string;

  @ApiProperty({ description: 'Class ID', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', required: false })
  @IsString()
  @IsOptional()
  class_id: string;

  @ApiProperty({ description: 'Class name', example: 'class1', required: false })
  @IsString()
  @IsOptional()
  class_name: string;
}
