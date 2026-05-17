import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class WordUploadTemplateDto {
  @ApiProperty({ description: 'English word', example: 'apple' })
  @IsString()
  @IsNotEmpty()
  english_word: string;

  @ApiProperty({
    description: 'Word phonetics',
    example: '/ap-el/',
    required: false,
  })
  @IsString()
  @IsOptional()
  phonetics?: string;

  @ApiProperty({ description: 'Bangla word', example: 'আপেল' })
  @IsString()
  @IsNotEmpty()
  bangla_word: string;

  @ApiProperty({
    description: 'Part of speech',
    example: 'noun',
    required: false,
  })
  @IsString()
  @IsOptional()
  part_of_speech?: string;

  @ApiProperty({ description: 'Class name', example: 'Class 5' })
  @IsString()
  @IsNotEmpty()
  class: string;

  @ApiProperty({ description: 'english meaning', example: 'some eng meaning' })
  @IsString()
  @IsNotEmpty()
  english_meaning: string;

  @ApiProperty({
    description: 'Example sentence',
    example: 'I ate an apple.',
    required: false,
  })
  @IsString()
  @IsOptional()
  sentence?: string;

  @ApiProperty({
    description: 'Comma separated synonyms',
    example: 'fruit, pome',
    required: false,
  })
  @IsString()
  @IsOptional()
  synonyms?: string;

  @ApiProperty({
    description: 'Comma separated antonyms',
    example: 'opposite word',
    required: false,
  })
  @IsString()
  @IsOptional()
  antonyms?: string;
}
