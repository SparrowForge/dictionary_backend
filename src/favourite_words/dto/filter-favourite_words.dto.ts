import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterFavouriteWordsDto extends PaginationDto {
  @ApiProperty({ description: 'Student id', example: 'xxxxx xxxxx xxxxx' })
  @IsString()
  @IsOptional()
  student_id: string;

  @ApiProperty({ description: 'Word id', example: 'class1' })
  @IsString()
  @IsOptional()
  word_id: string;
}
