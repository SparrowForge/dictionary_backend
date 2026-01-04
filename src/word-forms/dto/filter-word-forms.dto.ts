import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterWordFormsDto extends PaginationDto {
  @ApiProperty({ description: 'Word id', example: 'class1' })
  @IsString()
  @IsOptional()
  word_id: string;

  @ApiProperty({ description: 'Word form_type', example: 'form_type', })
  @IsString()
  @IsOptional()
  form_type: string;

  @ApiProperty({ description: 'Word form_value', example: 'form_value', })
  @IsString()
  @IsOptional()
  form_value: string;
}
