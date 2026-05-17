import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';
import { Status } from 'src/common/enums';

export class FilterClassesDto extends PaginationDto {
  @ApiProperty({ description: 'Class name', example: 'class1', required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'Class active status', example: Status.ACTIVE, default: Status.ACTIVE, required: false })
  @IsEnum(Status, { message: 'Status must be active or inactive' })
  @IsOptional()
  status: Status;

  @ApiProperty({ description: 'Catagory ID', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', required: false })
  @IsString()
  @IsOptional()
  catagory_id: string;

}
