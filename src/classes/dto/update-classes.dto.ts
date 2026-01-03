import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { Status } from 'src/common/enums';
import { CreateClassesDto } from './create-classes.dto';

export class UpdateClassesDto extends PartialType(CreateClassesDto) {
  @ApiProperty({ description: 'Class name', example: 'class1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Class name order/serial', example: '1', default: 0 })
  @IsNumber()
  @IsOptional()
  order_no: number;

  @ApiProperty({ description: 'Class active status', example: Status.ACTIVE, default: Status.ACTIVE })
  @IsEnum(Status, { message: 'Status must be active or inactive' })
  @IsNotEmpty()
  status: Status;

  @ApiProperty({ description: 'Created by user id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', })
  @IsString()
  @IsOptional()
  updated_by: string;
}
