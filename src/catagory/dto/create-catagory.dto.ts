import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, } from 'class-validator';
import { Status } from 'src/common/enums';

export class CreateCatagoryDto {
  @ApiProperty({ description: 'Catagory name', example: 'catagory1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Catagory name order/serial', example: '1', default: 0 })
  @IsNumber()
  @IsOptional()
  order_no: number;

  @ApiProperty({ description: 'Catagory active status', example: Status.ACTIVE, default: Status.ACTIVE })
  @IsEnum(Status, { message: 'Status must be active or inactive' })
  @IsNotEmpty()
  status: Status;

  @ApiProperty({ description: 'Created by user id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', })
  @IsString()
  @IsOptional()
  created_by: string;
}
