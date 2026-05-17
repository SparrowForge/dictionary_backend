import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterFavouriteWordsDto extends PaginationDto {
  @ApiProperty({ description: 'Student ID', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', required: false })
  @IsString()
  @IsOptional()
  student_id: string;

  @ApiProperty({ description: 'Word ID', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', required: false })
  @IsString()
  @IsOptional()
  word_id: string;
}
