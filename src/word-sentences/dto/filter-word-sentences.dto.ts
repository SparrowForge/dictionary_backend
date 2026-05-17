import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterWordSentencesDto extends PaginationDto {
  @ApiProperty({ description: 'Word id', example: 'class1', required: false })
  @IsString()
  @IsOptional()
  word_id: string;

  @ApiProperty({ description: 'Sentence', example: 'I read a book every night.', required: false })
  @IsString()
  @IsOptional()
  sentence: string;
}
