import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';
import { WordStatusEnum } from 'src/common/enums/word-status.enum';

export class FilterWordsDto extends PaginationDto {
  @ApiProperty({ description: 'English word', example: 'Good', required: false })
  @IsString()
  @IsOptional()
  english_word: string;

  @ApiProperty({ description: 'Bangla word', example: '...', required: false })
  @IsString()
  @IsOptional()
  bangla_word: string;

  @ApiProperty({ description: 'English word', example: 'Good', required: false })
  @IsString()
  @IsOptional()
  part_of_speech: string;

  @ApiProperty({ description: 'English word', example: 'Good', required: false })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'Word Status', example: WordStatusEnum.PENDING, required: true })
  @IsEnum(WordStatusEnum, { message: `status must be one of: ${Object.values(WordStatusEnum).join(', ')}`, })
  @IsOptional()
  status: WordStatusEnum;

  @ApiProperty({ description: 'approved_by User id', example: 'xxxx xxxx xxxxx xxx', required: false })
  @IsString()
  @IsOptional()
  approved_by_user_id: string;
}
