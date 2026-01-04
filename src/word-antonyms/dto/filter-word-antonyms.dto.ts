import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterWordAntonymsDto extends PaginationDto {
  @ApiProperty({ description: 'Word id', example: 'class1' })
  @IsString()
  @IsOptional()
  word_id: string;

  @ApiProperty({ description: 'Word antonym', example: 'antonym', })
  @IsString()
  @IsOptional()
  antonym: string;
}
