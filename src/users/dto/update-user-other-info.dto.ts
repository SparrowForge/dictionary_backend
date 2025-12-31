import { ApiProperty, } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { Status } from '../../common/enums';

export class UpdateUserOtherInfoDto {

  @ApiProperty({ description: 'User phone number', example: '+880', required: true, })
  @IsString()
  phone_no: string;

  @ApiProperty({ description: 'User first name', example: 'John', required: false, })
  @IsOptional()
  first_name?: string;

  @ApiProperty({ description: 'User last name', example: 'Doe', required: false, })
  @IsOptional()
  last_name?: string;

  @ApiProperty({ description: 'Primary address', example: 'primary address', required: false, })
  @IsOptional()
  address_line_1?: string;

  @ApiProperty({ description: 'Secondary address', example: 'secondary address', required: false, })
  @IsOptional()
  address_line_2?: string;

  @ApiProperty({ description: 'City', example: 'New York', required: false, })
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'Post Code', example: '00256', required: false, })
  @IsOptional()
  post_code?: string;

  @ApiProperty({ description: 'Country', example: 10, required: false, })
  @IsNumber()
  @IsOptional()
  country_id?: number;

  @ApiProperty({ description: 'State', example: 'some state name', required: false, })
  @IsOptional()
  state?: string;

  @ApiProperty({ description: 'User Date Of Birth', example: '1990-03-14T12:00:00.000Z', required: false, })
  @IsDateString()
  @IsOptional()
  date_of_birth?: Date;

  @ApiProperty({ description: 'User role ID', example: 1, })
  @IsString()
  @IsOptional()
  roleId?: string;

  @ApiProperty({ description: 'User status', example: 'active', enum: Status, })
  @IsEnum(Status, { message: 'status must be either active or inactive' })
  @IsOptional()
  status?: Status = Status.ACTIVE;
}
