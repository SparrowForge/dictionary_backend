import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, } from 'class-validator';

export class CreateWordAntonymsDto {
  @ApiProperty({ description: 'Word id', example: 'class1' })
  @IsString()
  @IsNotEmpty()
  word_id: string;

  @ApiProperty({ description: 'Word antonym', example: 'antonym', })
  @IsString()
  @IsNotEmpty()
  antonym: string;

  @ApiProperty({ description: 'Created by user id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', })
  @IsString()
  @IsOptional()
  created_by: string;
}
