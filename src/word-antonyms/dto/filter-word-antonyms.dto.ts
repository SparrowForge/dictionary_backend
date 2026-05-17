import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterWordAntonymsDto extends PaginationDto {
  @ApiProperty({ description: 'Word ID', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', required: false })
  @IsString()
  @IsOptional()
  word_id: string;

  @ApiProperty({ description: 'Word antonym', example: 'bad', required: false })
  @IsString()
  @IsOptional()
  antonym: string;
}
