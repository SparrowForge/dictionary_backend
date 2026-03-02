import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { CreateWordSynonymsDto } from './create-word-synonyms.dto';

export class UpdateWordSynonymsDto extends PartialType(CreateWordSynonymsDto) {
  @ApiProperty({ description: 'Word id', example: 'class1' })
  @IsString()
  @IsNotEmpty()
  word_id: string;

  @ApiProperty({ description: 'Word synonym', example: 'synonym', })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty()
  synonym: string[];

  @ApiProperty({ description: 'Created by user id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', })
  @IsString()
  @IsOptional()
  updated_by: string;
}
