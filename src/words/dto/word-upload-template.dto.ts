import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class WordUploadTemplateDto {
  @ApiProperty({ description: 'English word', example: 'apple' })
  @IsString()
  @IsNotEmpty()
  english_word: string;

  @ApiProperty({ description: 'Bangla word', example: 'আপেল' })
  @IsString()
  @IsNotEmpty()
  bangla_word: string;

  @ApiProperty({ description: 'Part of speech', example: 'noun', required: false })
  @IsString()
  @IsOptional()
  part_of_speech?: string;

  @ApiProperty({ description: 'Word description', example: 'A round fruit.', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Class name', example: 'Class 5' })
  @IsString()
  @IsNotEmpty()
  class: string;

  @ApiProperty({ description: 'english meaning', example: 'some eng meaning' })
  @IsString()
  @IsNotEmpty()
  english_meaning: string;
}
