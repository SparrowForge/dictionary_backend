import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterTeacherDto extends PaginationDto {

  @ApiProperty({ description: 'User id', example: 'xxxxx xxxxx xxxxx', })
  @IsString()
  @IsOptional()
  user_id: string;

  @ApiProperty({ description: 'User name', example: 'Some one', })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'Teacher designation', example: 'Some Designation', })
  @IsString()
  @IsOptional()
  designation: string;

}
