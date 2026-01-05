import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, } from 'class-validator';

export class CreateWordMediaDto {
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
  created_by: string;
}
