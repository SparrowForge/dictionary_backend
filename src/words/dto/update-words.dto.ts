import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { CreateWordsDto } from './create-words.dto';
import { WordStatusEnum } from '../../common/enums/word-status.enum';
import { WordFormEntryDto } from './word-form-entry.dto';

export class UpdateWordsDto extends PartialType(CreateWordsDto) {
  @ApiProperty({ description: 'English word', example: 'Good', required: true })
  @IsString()
  @IsNotEmpty()
  english_word: string;

  @ApiProperty({ description: 'Word phonetics', example: '/gud/', required: false })
  @IsString()
  @IsOptional()
  phonetics: string;

  @ApiProperty({ description: 'Bangla word', example: '...', required: true })
  @IsString()
  @IsNotEmpty()
  bangla_word: string;

  @ApiProperty({ description: 'English word', example: 'Good', required: false })
  @IsString()
  @IsOptional()
  part_of_speech: string;

  @ApiProperty({ description: 'English word', example: 'Good', required: false })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'English meaning', example: 'Good', required: false })
  @IsString()
  @IsOptional()
  english_meaning: string;

  @ApiProperty({ description: 'Word Status', example: WordStatusEnum.PENDING, required: true })
  @IsEnum(WordStatusEnum)
  @IsNotEmpty()
  status: WordStatusEnum;

  @ApiProperty({ description: 'approved_by User id', example: 'xxxx xxxx xxxxx xxx', required: false })
  @IsString()
  @IsOptional()
  approved_by_user_id: string;

  @ApiProperty({ description: 'Word approved at', example: '2025-03-14T12:00:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  approved_at: Date;

  @ApiProperty({ description: 'List of class ids', example: ['xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'], required: false })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  @IsOptional()
  class_ids?: string[];

  @ApiProperty({
    description: 'Verb forms, only allowed when part_of_speech is "verb". Replaces all existing verb forms for this word.',
    type: () => [WordFormEntryDto],
    required: false,
    example: [
      { form_type: 'past_tense', form_value: 'ran' },
      { form_type: 'past_participle', form_value: 'run' },
      { form_type: 'present_participle', form_value: 'running' },
      { form_type: 'third_person_singular', form_value: 'runs' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WordFormEntryDto)
  @IsOptional()
  word_forms?: WordFormEntryDto[];

  @ApiProperty({ description: 'Created by user id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', required: false })
  @IsString()
  @IsOptional()
  updated_by: string;
}
