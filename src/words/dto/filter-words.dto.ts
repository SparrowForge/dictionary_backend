import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';
import { WordStatusEnum } from 'src/common/enums/word-status.enum';
import { Transform } from 'class-transformer';

export class FilterWordsDto extends PaginationDto {
  @ApiProperty({ description: 'English word', example: 'Good', required: false })
  @IsString()
  @IsOptional()
  english_word: string;

  @ApiProperty({ description: 'Bangla word', example: '...', required: false })
  @IsString()
  @IsOptional()
  bangla_word: string;

  @ApiProperty({ description: 'Part of speech', example: 'noun', required: false })
  @IsString()
  @IsOptional()
  part_of_speech: string;

  @ApiProperty({ description: 'Word description', example: 'A positive quality or state', required: false })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'Word Status', example: WordStatusEnum.PENDING, required: false })
  @IsEnum(WordStatusEnum, { message: `status must be one of: ${Object.values(WordStatusEnum).join(', ')}`, })
  @IsOptional()
  status: WordStatusEnum;

  @ApiProperty({ description: 'Approved by user ID', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', required: false })
  @IsString()
  @IsOptional()
  approved_by_user_id: string;

  @ApiProperty({ description: 'Class ID', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', required: false })
  @IsString()
  @IsOptional()
  class_id: string;

  @ApiProperty({ description: 'Class name', example: 'class1', required: false })
  @IsString()
  @IsOptional()
  class_name: string;

  @ApiProperty({ description: 'Sort by most viewed words', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string' && value.toLowerCase() === 'true') return true;
    if (typeof value === 'string' && value.toLowerCase() === 'false') return false;
    return undefined;
  })
  is_most_viewed: boolean;


}
