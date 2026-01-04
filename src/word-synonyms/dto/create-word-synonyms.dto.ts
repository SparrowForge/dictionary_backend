import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, } from 'class-validator';

export class CreateWordSynonymsDto {
  @ApiProperty({ description: 'Word id', example: 'class1' })
  @IsString()
  @IsNotEmpty()
  word_id: string;

  @ApiProperty({ description: 'Word synonym', example: 'synonym', })
  @IsString()
  @IsNotEmpty()
  synonym: string;

  @ApiProperty({ description: 'Created by user id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', })
  @IsString()
  @IsOptional()
  created_by: string;
}
