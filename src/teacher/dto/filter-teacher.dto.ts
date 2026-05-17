import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterTeacherDto extends PaginationDto {

  @ApiProperty({ description: 'User ID', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', required: false })
  @IsString()
  @IsOptional()
  user_id: string;

  @ApiProperty({ description: 'Teacher name', example: 'Some one', required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'Teacher designation', example: 'Some Designation', required: false })
  @IsString()
  @IsOptional()
  designation: string;

}
