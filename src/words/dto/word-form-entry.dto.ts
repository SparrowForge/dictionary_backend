import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { VerbFormTypeEnum } from '../../common/enums/verb-form-type.enum';

export class WordFormEntryDto {
  @ApiProperty({
    description: 'Verb form type',
    enum: VerbFormTypeEnum,
    example: VerbFormTypeEnum.PAST_TENSE,
  })
  @IsEnum(VerbFormTypeEnum, {
    message: `form_type must be one of: ${Object.values(VerbFormTypeEnum).join(', ')}`,
  })
  @IsNotEmpty()
  form_type: VerbFormTypeEnum;

  @ApiProperty({ description: 'Verb form value', example: 'ran' })
  @IsString()
  @IsNotEmpty()
  form_value: string;
}
