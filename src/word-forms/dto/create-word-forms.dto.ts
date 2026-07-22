import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, } from 'class-validator';
import { VerbFormTypeEnum } from 'src/common/enums/verb-form-type.enum';

export class CreateWordFormsDto {
  @ApiProperty({ description: 'Word id', example: 'class1' })
  @IsString()
  @IsNotEmpty()
  word_id: string;

  @ApiProperty({ description: 'Word form_type', enum: VerbFormTypeEnum, example: VerbFormTypeEnum.PAST_TENSE, })
  @IsEnum(VerbFormTypeEnum, {
    message: `form_type must be one of: ${Object.values(VerbFormTypeEnum).join(', ')}`,
  })
  @IsNotEmpty()
  form_type: VerbFormTypeEnum;

  @ApiProperty({ description: 'Word form_value', example: 'form_value', })
  @IsString()
  @IsNotEmpty()
  form_value: string;

  @ApiProperty({ description: 'Created by user id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', })
  @IsString()
  @IsOptional()
  created_by: string;
}
