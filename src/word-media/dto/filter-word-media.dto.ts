import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterWordMediaDto extends PaginationDto {
  @ApiProperty({ description: 'Word id', example: 'class1' })
  @IsString()
  @IsOptional()
  word_id: string;

  // @ApiProperty({ description: 'Word form_type', example: 'form_type', })
  // @IsString()
  // @IsOptional()
  // sentence: string;
}
