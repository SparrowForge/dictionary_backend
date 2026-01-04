import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { CreateWordFormsDto } from './create-word-forms.dto';

export class UpdateWordFormsDto extends PartialType(CreateWordFormsDto) {
  @ApiProperty({ description: 'Word id', example: 'class1' })
  @IsString()
  @IsNotEmpty()
  word_id: string;

  @ApiProperty({ description: 'Word form_type', example: 'form_type', })
  @IsString()
  @IsNotEmpty()
  form_type: string;

  @ApiProperty({ description: 'Word form_value', example: 'form_value', })
  @IsString()
  @IsNotEmpty()
  form_value: string;

  @ApiProperty({ description: 'Created by user id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', })
  @IsString()
  @IsOptional()
  updated_by: string;
}
