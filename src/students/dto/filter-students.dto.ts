import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterStudentsDto extends PaginationDto {
  @ApiProperty({ description: 'Student name', example: 'some one', required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'User id', example: 'xxxx xxxx xxxxx xxx', required: false })
  @IsString()
  @IsOptional()
  user_id: string;

  @ApiProperty({ description: 'Student id card number', example: '012546', required: false })
  @IsString()
  @IsOptional()
  student_id: string;

  @ApiProperty({ description: 'Class id', example: 'xxxx xxxx xxxxx xxx', required: false })
  @IsString()
  @IsOptional()
  class_id: string;

  @ApiProperty({ description: 'Student name', example: 'some one', required: false })
  @IsString()
  @IsOptional()
  class_name: string;
}
