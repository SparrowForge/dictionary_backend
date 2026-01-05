import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { CreateWordMediaDto } from './create-word-media.dto';

export class UpdateWordMediaDto extends PartialType(CreateWordMediaDto) {
  @ApiProperty({ description: 'Word id', example: 'class1' })
  @IsString()
  @IsNotEmpty()
  word_id: string;

  @ApiProperty({ description: 'audio_id', example: 9 })
  @IsNumber()
  @IsOptional()
  audio_id: number;

  @ApiProperty({ description: 'image_id', example: 2 })
  @IsNumber()
  @IsOptional()
  image_id: number;

  @ApiProperty({ description: 'Created by user id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', })
  @IsString()
  @IsOptional()
  updated_by: string;
}
