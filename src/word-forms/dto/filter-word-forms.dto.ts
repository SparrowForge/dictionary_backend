import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterWordFormsDto extends PaginationDto {
  @ApiProperty({ description: 'Word ID', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', required: false })
  @IsString()
  @IsOptional()
  word_id: string;

  @ApiProperty({ description: 'Word form type', example: 'past_tense', required: false })
  @IsString()
  @IsOptional()
  form_type: string;

  @ApiProperty({ description: 'Word form value', example: 'went', required: false })
  @IsString()
  @IsOptional()
  form_value: string;
}
